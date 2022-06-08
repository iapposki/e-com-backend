const Razorpay = require('razorpay');
const {razorpayKeys} = require('../config');

// console.log(razorpayKeys.keyId, razorpayKeys.keySecret);

const rzp = new Razorpay({
    key_id: razorpayKeys.keyId,
    key_secret: razorpayKeys.keySecret
})


module.exports = rzp;