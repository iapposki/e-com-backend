const { createUser, validateUsernamePassword, getUserByEmail, generateToken, updatePassword, toggleVerification } = require('../services/user.service')
const logger = require('../log/index');
const sendEmail = require('../services/email.service');
const { getRedis } = require('../services/redis.service');


const login = async (req, res) => {
    const { email, password } = req.body;
    logger.info(req.body)
    // console.log("Initializing user login");
    if (!(email && password)) {
        res.status(400).json({ msg: 'Email or password missing' });
    } else {
        try {
            const response = await validateUsernamePassword(email, password);
            if (response && response.pass) {
                res.status(200).json({ msg: 'Login successful', at: response.tokens.at, rt: response.tokens.rt });
            } else {
                res.status(401).json({ msg: 'Invalid credentials' });
                logger.info("Invalid credentialsssssssssss");
            }
        } catch (error) {
            logger.error(error.stack);
            // console.log(error.stack);
            res.status(500).json({ msg: 'Something Failed' });
        }
    }
}

const signUp = async (req, res) => {

    const { name, email, password, confirmPassword, phoneNumber, dob } = req.body;
    // console.log("Initializing user creation");

    var condition = true;

    // Check if all fields are present
    if (!(name && email && password && phoneNumber && confirmPassword)) {
        res.status(400).json({ msg: 'Insufficient information' });
        condition = false;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        res.status(400).json({ msg: 'Passwords do not match' });
        condition = false;
    }
    if (condition) {
        try {
            const redisClient = await getRedis()
            const tokens = await createUser({ name, email, password, phoneNumber, dob });
            await redisClient.SET("rt-" + email, tokens.rt, {
                EX: 604800
            })

            // await prisma.user.create({
            //     data: {
            //         name, email, password, phoneNumber, dob 
            //     }
            // })
            sendEmail({
                to: email,
                subject: 'Welcome to the e-commerce app',
                text: `Hi ${name},\n\nWelcome to the e-commerce app.\n\nPlease click on the following link to verify your account:\n\nhttp://localhost:3000/auth/signup/verify?at=${tokens.at}&rt=${tokens.rt}\n\nRegards,\n\nE-commerce team`,
                html: '<h1>Welcome</h1>'
            })
            res.status(201).json({ msg: 'User created successfully', tokens: tokens });
        } catch (error) {
            console.log(error.stack);
            res.status(500).json({ msg: 'Something Failed' });
        }
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) {
            res.status(400).json({ msg: 'Email missing' });
        };
        const user = await getUserByEmail(email);
        if (!user) {
            res.status(404).json({ msg: 'User not found' });
        };
        const token = await generateToken(user.name, user.email, user.role, expiry = '10m');
        await sendEmail({
            to: email,
            subject: 'Reset Password',
            text: `Hi ${user.name},\n\nPlease click on the following link to reset your password:\n\nhttp://localhost:3000/auth/resetpassword?token=${token}\n\nRegards,\n\nE-commerce team`,
            html: '<h1>Reset Password</h1>'
        })
        res.status(200).json({ msg: 'Token generated', token: token });
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({ msg: 'Something Failed' });
    }
};

const resetPassword = async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { email } = req.userDetails;

    try {
        if (password !== confirmPassword) {
            res.status(400).json({ msg: 'Passwords do not match' });
        } else {
            await updatePassword(email, password);
            res.status(200).json({ msg: 'Password updated' });
        }
    } catch (error) {
        console.log(error.stack);
        res.status(500).json({ msg: 'Something Failed' });
    }
};

const verifyUser = async (req, res) => {
    const { email } = req.userDetails;
    const user = await getUserByEmail(email);
    if (user.isVerified) {
        res.status(200).json({ msg: 'User already verified' });
    } else {
        toggleVerification(email, false);
        res.status(200).json({ msg: 'User verified' });
    }
}


module.exports = {
    login,
    signUp,
    forgotPassword,
    resetPassword,
    verifyUser
}