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
exports.resendOtp = exports.validateOtp = exports.createOtp = void 0;
// const {sendSMS} = require("../services/sms.service");
// const {getRedis} = require("../services/redis.service");
const sms_service_1 = require("../services/sms.service");
const redis_service_1 = require("../services/redis.service");
const createOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const { phoneNumber } = req.body;
    var shouldSendOtp = true;
    const redisClient = yield (0, redis_service_1.getRedis)();
    var otpData = yield redisClient.HGETALL("otp-" + phoneNumber);
    if (otpData && (Number(otpData.expire) > Date.now() && Number(otpData.tries) > 0)) {
        const msg = "otp already created";
        shouldSendOtp = false;
        res.send({ msg: msg });
    }
    else if (otpData && Number(otpData.expire) < Date.now()) {
        yield redisClient.HSET("otp-" + phoneNumber, "otp", otp);
        yield redisClient.HSET("otp-" + phoneNumber, "expire", Date.now() + 1000 * 60 * 5);
        yield redisClient.HSET("otp-" + phoneNumber, "tries", 5);
        const msg = "reset due to expiry";
        res.send({ msg: msg });
    }
    else if (otpData && Number(otpData.tries) < 1) {
        const msg = "no more tries, wait for " + (Number(otpData.expire) - Date.now()) / 1000 + "s";
        shouldSendOtp = false;
        res.send({ msg: msg });
    }
    else {
        yield redisClient.DEL("otp-" + phoneNumber);
        yield redisClient.HSET("otp-" + phoneNumber, "otp", otp);
        yield redisClient.HSET("otp-" + phoneNumber, "expire", Date.now() + 300000);
        yield redisClient.HSET("otp-" + phoneNumber, "tries", 5);
        const msg = "New otp generated";
        res.send({ msg: msg });
    }
    try {
        if (shouldSendOtp) {
            yield (0, sms_service_1.sendSMS)("OTP is " + otpData.otp, phoneNumber);
        }
        res.status(200);
    }
    catch (err) {
        console.log("Some error occured while sending OTP");
        console.log(err);
        res.status(400).send({ msg: 'Error while sending OTP' });
    }
});
exports.createOtp = createOtp;
const validateOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, otp } = req.body;
    const redisClient = yield (0, redis_service_1.getRedis)();
    const savedOtp = yield redisClient.HGETALL("otp-" + phoneNumber);
    // console.log(savedOtp, otp)
    if (otp === savedOtp.otp) {
        res.status(200).json({ success: true });
    }
    else {
        res.status(200).json({ success: false });
    }
});
exports.validateOtp = validateOtp;
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber } = req.body;
    const redisClient = yield (0, redis_service_1.getRedis)();
    var shouldResendOtp = false;
    const otpData = yield redisClient.HGETALL("otp-" + phoneNumber);
    if (otpData && (Number(otpData.expire) > Date.now() && Number(otpData.tries) > 0)) {
        yield redisClient.HSET("otp-" + phoneNumber, "tries", Number(otpData.tries) - 1);
        const msg = "otp resent";
        shouldResendOtp = true;
        res.send({ msg: msg });
    }
    else if (otpData && Number(otpData.expire) < Date.now()) {
        const msg = "OTP expired, please create a new OTP";
        res.send({ msg: msg });
    }
    else if (otpData && Number(otpData.tries) < 1) {
        const msg = "no more tries, wait for " + (Number(otpData.expire) - Date.now()) / 1000 + "s";
        res.send({ msg: msg });
    }
    else {
        const msg = "Please create new OTP";
        res.send({ msg: msg });
    }
    try {
        if (shouldResendOtp) {
            yield (0, sms_service_1.sendSMS)("OTP is " + otpData.otp, phoneNumber);
        }
        res.status(200);
    }
    catch (err) {
        console.log("Some error occured while sending OTP");
        console.log(err);
        res.status(400).send({ msg: 'Error while sending OTP' });
    }
});
exports.resendOtp = resendOtp;
