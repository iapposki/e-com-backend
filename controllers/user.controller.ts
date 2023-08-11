import { createUser, validateUsernamePassword, getUserByEmail, generateToken, updatePassword, toggleVerification } from "../services/user.service";
import { logger } from "../log";
import { sendEmail } from "../services/email.service";
import { getRedis } from "../services/redis.service";
import { Request, Response } from "express";
import { User } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            userDetails?: any
        }
    }
}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    logger.info(req.body)
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
        } catch (error: any) {
            logger.error(error.stack);
            res.status(500).json({ msg: 'Something Failed' });
        }
    }
}

export const signUp = async (req: Request, res: Response) => {
    const { name, email, password, confirmPassword, phoneNumber, dob } = req.body;
    var condition = true;
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
            sendEmail({
                to: email,
                subject: 'Welcome to the e-commerce app',
                text: `Hi ${name},\n\nWelcome to the e-commerce app.\n\nPlease click on the following link to verify your account:\n\nhttp://localhost:5000/auth/signup/verify?at=${tokens.at}&rt=${tokens.rt}\n\nRegards,\n\nE-commerce team`,
                html: '<h1>Welcome</h1>'
            })
            res.status(201).json({ msg: 'User created successfully', tokens: tokens });
        } catch (error: any) {
            console.log(error.stack);
            res.status(500).json({ msg: 'Something Failed' });
        }
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        if (!email) {
            res.status(400).json({ msg: 'Email missing' });
        };
        const user: User | null = await getUserByEmail(email);
        if (!user) {
            res.status(404).json({ msg: 'User not found' });
        } else {

            const token = await generateToken(user.name, user.email, user.role, '10m');
            await sendEmail({
                to: email,
                subject: 'Reset Password',
                text: `Hi ${user.name},\n\nPlease click on the following link to reset your password:\n\nhttp://localhost:3000/auth/resetpassword?token=${token}\n\nRegards,\n\nE-commerce team`,
                html: '<h1>Reset Password</h1>'
            })
            res.status(200).json({ msg: 'Token generated', token: token });
        };
    } catch (error: any) {
        console.log(error.stack);
        res.status(500).json({ msg: 'Something Failed' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    const { password, confirmPassword } = req.body;
    const { email } = req.userDetails;

    try {
        if (password !== confirmPassword) {
            res.status(400).json({ msg: 'Passwords do not match' });
        } else {
            await updatePassword(email, password);
            res.status(200).json({ msg: 'Password updated' });
        }
    } catch (error: any) {
        console.log(error.stack);
        res.status(500).json({ msg: 'Something Failed' });
    }
};

export const verifyUser = async (req: Request, res: Response) => {
    const { email } = req.userDetails;
    const user: User | null = await getUserByEmail(email);
    if (user && user.isVerified) {
        res.status(200).json({ msg: 'User already verified' });
    } else {
        toggleVerification(email, false);
        res.status(200).json({ msg: 'User verified' });
    }
}

