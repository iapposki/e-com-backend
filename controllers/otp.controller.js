const {sendSMS} = require("../services/sms.service");

const createOTP = async (req, res) => {
    const otp = '1122';
    const someUser = '+919587501877';

    try {
        await sendSMS("OTP is " + otp, someUser);
    res.status(200).send({msg: 'OTP sent successfully'});
    } catch (err) {
        console.log("Some error occured while sending OTP");
        console.log(err)
        res.status(400).send({msg: 'Error while sending OTP'});
    }
}

module.exports = {
    createOTP
}