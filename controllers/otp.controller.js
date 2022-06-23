const {sendSMS} = require("../services/sms.service");
const {getRedis} = require("../services/redis.service");

const createOtp = async (req, res) => {

    const otp = Math.floor(1000 + Math.random()*9000);
    const {phoneNumber} = req.body;
    var shouldSendOtp = true;
    const redisClient = await getRedis();
    var otpData = await redisClient.HGETALL("otp-" + phoneNumber);
    if (otpData && (otpData.expire > Date.now() && otpData.tries > 0)){
        const msg = "otp already created"
        shouldSendOtp = false;
        res.send({msg: msg});
    } else if (otpData && otpData.expire < Date.now()) {
        await redisClient.HSET("otp-" + phoneNumber, "otp", otp);
        await redisClient.HSET("otp-" + phoneNumber, "expire", Date.now() + 1000*60*5);
        await redisClient.HSET("otp-" + phoneNumber, "tries", 5);
        const msg = "reset due to expiry"
        res.send({msg: msg});
    } else if (otpData && otpData.tries < 1) {
        const msg = "no more tries, wait for " + (otpData.expire - Date.now())/1000 + "s"
        shouldSendOtp = false;
        res.send({msg: msg});
    } else {
        await redisClient.DEL("otp-" + phoneNumber);
        await redisClient.HSET("otp-" + phoneNumber, "otp", otp);
        await redisClient.HSET("otp-" + phoneNumber, "expire", Date.now() + 300000);
        await redisClient.HSET("otp-" + phoneNumber, "tries", 5);
        const msg = "New otp generated"
        res.send({msg: msg});
    }
    

    try {
        if (shouldSendOtp) {
        await sendSMS("OTP is " + otpData.otp, phoneNumber);
        }
        res.status(200);
    } catch (err) {
        console.log("Some error occured while sending OTP");
        console.log(err)
        res.status(400).send({msg: 'Error while sending OTP'});
    }
}

const validateOtp = async (req, res) => {
    const {phoneNumber, otp} = req.body;
    const redisClient = await getRedis();
    const savedOtp = await redisClient.get("otp-" + phoneNumber);
    console.log(savedOtp, otp)
    if (otp === savedOtp){
        res.status(200).json({success: true});
    } else {
        res.status(200).json({success: false});
    }
}

const resendOtp = async (req, res) => {
    const {phoneNumber} = req.body;
    const redisClient = await getRedis();
    var shouldResendOtp = false;
    const otpData = await redisClient.HGETALL("otp-" + phoneNumber);
    if (otpData && (otpData.expire > Date.now() && otpData.tries > 0)){
        await redisClient.HSET("otp-" + phoneNumber, "tries", otpData.tries - 1);
        const msg = "otp resent"
        shouldResendOtp = true;
        res.send({msg: msg});
    } else if (otpData && otpData.expire < Date.now()) {
        const msg = "OTP expired, please create a new OTP"
        res.send({msg: msg});
    } else if (otpData && otpData.tries < 1) {
        const msg = "no more tries, wait for " + (otpData.expire - Date.now())/1000 + "s"
        res.send({msg: msg});
    } else {
        const msg = "Please create new OTP"
        res.send({msg: msg});
    }
    try {
        if (shouldResendOtp) {
        await sendSMS("OTP is " + otpData.otp, phoneNumber);
        }
    res.status(200);
    } catch (err) {
        console.log("Some error occured while sending OTP");
        console.log(err)
        res.status(400).send({msg: 'Error while sending OTP'});
    }

}

module.exports = {
    createOtp,
    validateOtp,
    resendOtp
}