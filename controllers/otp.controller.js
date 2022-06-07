const {sendSMS} = require("../services/sms.service");
const {getRedis} = require("../services/redis.service");

const createOTP = async (req, res) => {
    
    const otp = Math.floor(1000 + Math.random()*9000);
    const {phoneNumber} = req.body;

    const redisClient = await getRedis();
    await redisClient.setex("otp-" + phoneNumber, otp);

    try {
        await sendSMS("OTP is " + otp, phoneNumber);
    res.status(200).send({msg: 'OTP sent successfully'});
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

module.exports = {
    createOTP,
    validateOtp
}