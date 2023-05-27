import { config } from "../config"
const twilio = config.twilio
const client = require('twilio')(twilio.apiSID, twilio.apiAuthToken);

export const sendSMS = async (body: string, to: string) => {
    await client.messages.create({ body, from: twilio.myNumber, to })
}