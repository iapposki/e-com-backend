// const {sendSMS} = require("../services/sms.service");
// const {getRedis} = require("../services/redis.service");
import { sendSMS } from "../services/sms.service";
import { getRedis } from "../services/redis.service";
import { Request, Response } from "express";

export const createOtp = async (req: Request, res: Response) => {

    const otp = Math.floor(1000 + Math.random() * 9000);
    const { phoneNumber } = req.body;
    var shouldSendOtp = true;
    const redisClient = await getRedis();
    var otpData = await redisClient.HGETALL("otp-" + phoneNumber);
    if (otpData && (Number(otpData.expire) > Date.now() && Number(otpData.tries) > 0)) {
        const msg = "otp already created"
        shouldSendOtp = false;
        res.send({ msg: msg });
    } else if (otpData && Number(otpData.expire) < Date.now()) {
        await redisClient.HSET("otp-" + phoneNumber, "otp", otp);
        await redisClient.HSET("otp-" + phoneNumber, "expire", Date.now() + 1000 * 60 * 5);
        await redisClient.HSET("otp-" + phoneNumber, "tries", 5);
        const msg = "reset due to expiry"
        res.send({ msg: msg });
    } else if (otpData && Number(otpData.tries) < 1) {
        const msg = "no more tries, wait for " + (Number(otpData.expire) - Date.now()) / 1000 + "s"
        shouldSendOtp = false;
        res.send({ msg: msg });
    } else {
        await redisClient.DEL("otp-" + phoneNumber);
        await redisClient.HSET("otp-" + phoneNumber, "otp", otp);
        await redisClient.HSET("otp-" + phoneNumber, "expire", Date.now() + 300000);
        await redisClient.HSET("otp-" + phoneNumber, "tries", 5);
        const msg = "New otp generated"
        res.send({ msg: msg });
    }


    try {
        if (shouldSendOtp) {
            await sendSMS("OTP is " + otpData.otp, phoneNumber);
        }
        res.status(200);
    } catch (err) {
        console.log("Some error occured while sending OTP");
        console.log(err)
        res.status(400).send({ msg: 'Error while sending OTP' });
    }
}

export const validateOtp = async (req: Request, res: Response) => {
    const { phoneNumber, otp } = req.body;
    const redisClient = await getRedis();
    const savedOtp = await redisClient.HGETALL("otp-" + phoneNumber);
    // console.log(savedOtp, otp)
    if (otp === savedOtp.otp) {
        res.status(200).json({ success: true });
    } else {
        res.status(200).json({ success: false });
    }
}

export const resendOtp = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    const redisClient = await getRedis();
    var shouldResendOtp = false;
    const otpData = await redisClient.HGETALL("otp-" + phoneNumber);
    if (otpData && (Number(otpData.expire) > Date.now() && Number(otpData.tries) > 0)) {
        await redisClient.HSET("otp-" + phoneNumber, "tries", Number(otpData.tries) - 1);
        const msg = "otp resent"
        shouldResendOtp = true;
        res.send({ msg: msg });
    } else if (otpData && Number(otpData.expire) < Date.now()) {
        const msg = "OTP expired, please create a new OTP"
        res.send({ msg: msg });
    } else if (otpData && Number(otpData.tries) < 1) {
        const msg = "no more tries, wait for " + (Number(otpData.expire) - Date.now()) / 1000 + "s"
        res.send({ msg: msg });
    } else {
        const msg = "Please create new OTP"
        res.send({ msg: msg });
    }
    try {
        if (shouldResendOtp) {
            await sendSMS("OTP is " + otpData.otp, phoneNumber);
        }
        res.status(200);
    } catch (err) {
        console.log("Some error occured while sending OTP");
        console.log(err)
        res.status(400).send({ msg: 'Error while sending OTP' });
    }

}