"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.resetPassword = exports.forgotPassword = exports.signUp = exports.login = void 0;
const user_service_1 = require("../services/user.service");
const log_1 = require("../log");
const email_service_1 = require("../services/email.service");
const redis_service_1 = require("../services/redis.service");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    log_1.logger.info(req.body);
    // console.log("Initializing user login");
    if (!(email && password)) {
        res.status(400).json({ msg: 'Email or password missing' });
    }
    else {
        try {
            const response = yield (0, user_service_1.validateUsernamePassword)(email, password);
            if (response && response.pass) {
                res.status(200).json({ msg: 'Login successful', at: response.tokens.at, rt: response.tokens.rt });
            }
            else {
                res.status(401).json({ msg: 'Invalid credentials' });
                log_1.logger.info("Invalid credentialsssssssssss");
            }
        }
        catch (error) {
            log_1.logger.error(error.stack);
            // console.log(error.stack);
            res.status(500).json({ msg: 'Something Failed' });
        }
    }
});
exports.login = login;
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const redisClient = yield (0, redis_service_1.getRedis)();
            const tokens = yield (0, user_service_1.createUser)({ name, email, password, phoneNumber, dob });
            yield redisClient.SET("rt-" + email, tokens.rt, {
                EX: 604800
            });
            // await prisma.user.create({
            //     data: {
            //         name, email, password, phoneNumber, dob 
            //     }
            // })
            (0, email_service_1.sendEmail)({
                to: email,
                subject: 'Welcome to the e-commerce app',
                text: `Hi ${name},\n\nWelcome to the e-commerce app.\n\nPlease click on the following link to verify your account:\n\nhttp://localhost:5000/auth/signup/verify?at=${tokens.at}&rt=${tokens.rt}\n\nRegards,\n\nE-commerce team`,
                html: '<h1>Welcome</h1>'
            });
            res.status(201).json({ msg: 'User created successfully', tokens: tokens });
        }
        catch (error) {
            console.log(error.stack);
            res.status(500).json({ msg: 'Something Failed' });
        }
    }
});
exports.signUp = signUp;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            res.status(400).json({ msg: 'Email missing' });
        }
        ;
        const user = yield (0, user_service_1.getUserByEmail)(email);
        if (!user) {
            res.status(404).json({ msg: 'User not found' });
        }
        else {
            const token = yield (0, user_service_1.generateToken)(user.name, user.email, user.role, '10m');
            yield (0, email_service_1.sendEmail)({
                to: email,
                subject: 'Reset Password',
                text: `Hi ${user.name},\n\nPlease click on the following link to reset your password:\n\nhttp://localhost:3000/auth/resetpassword?token=${token}\n\nRegards,\n\nE-commerce team`,
                html: '<h1>Reset Password</h1>'
            });
            res.status(200).json({ msg: 'Token generated', token: token });
        }
        ;
    }
    catch (error) {
        console.log(error.stack);
        res.status(500).json({ msg: 'Something Failed' });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword } = req.body;
    const { email } = req.userDetails;
    try {
        if (password !== confirmPassword) {
            res.status(400).json({ msg: 'Passwords do not match' });
        }
        else {
            yield (0, user_service_1.updatePassword)(email, password);
            res.status(200).json({ msg: 'Password updated' });
        }
    }
    catch (error) {
        console.log(error.stack);
        res.status(500).json({ msg: 'Something Failed' });
    }
});
exports.resetPassword = resetPassword;
const verifyUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.userDetails;
    const user = yield (0, user_service_1.getUserByEmail)(email);
    if (user && user.isVerified) {
        res.status(200).json({ msg: 'User already verified' });
    }
    else {
        (0, user_service_1.toggleVerification)(email, false);
        res.status(200).json({ msg: 'User verified' });
    }
});
exports.verifyUser = verifyUser;
