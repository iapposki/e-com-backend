const {twilio} = require('../config/index');
const client = require('twilio')(twilio.apiSID, twilio.apiAuthToken);

const sendSMS = async (body, to) => {
    await client.messages.create({body, from: twilio.myNumber, to})
}

module.exports = {
    sendSMS
}