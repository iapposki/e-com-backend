const {createUser, validateUsernamePassword} = require('../services/user.service')
const logger = require('../log/index')


const login = async (req, res) => {
    const {email, password} = req.body;
    logger.info(req.body)
    // console.log("Initializing user login");
    if (!(email && password)) {
        res.status(400).json({msg: 'Email or password missing'});
    } else {
        try {
            const response = await validateUsernamePassword(email, password);
            if (response && response.pass) {
                res.status(200).json({msg: 'Login successful', token: response.token});
            } else {
                res.status(401).json({msg: 'Invalid credentials'});
                logger.info("Invalid credentialsssssssssss");
            }
        } catch (error) {
            logger.error(error.stack);
            // console.log(error.stack);
            res.status(500).json({msg: 'Something Failed'});
        }
    }
}

const signUp = async (req, res) => {
    
    const {name, email, password, confirmPassword, phoneNumber, dob} = req.body;
    // console.log("Initializing user creation");

    var condition = true;

    // Check if all fields are present
    if (!(name && email && password && phoneNumber && confirmPassword)) {
        res.status(400).json({msg: 'Insufficient information'});
        condition = false;
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        res.status(400).json({msg: 'Passwords do not match'});
        condition = false;
    }
    if (condition) {
        try {
            const token = await createUser({name, email, password, phoneNumber, dob});
            // await prisma.user.create({
            //     data: {
            //         name, email, password, phoneNumber, dob 
            //     }
            // })
            res.status(201).json({msg: 'User created successfully', token: token});
        } catch (error) {
            console.log(error.stack);
            res.status(500).json({msg: 'Something Failed'});
        }
    }
}


module.exports = {
    login,
    signUp
}