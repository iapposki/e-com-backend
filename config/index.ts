import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  postgresURL:
    process.env["DATABASE_URL"] ||
    "postgres://postgres:password@localhost:5432/mydb",
  twilio: {
    apiSID: process.env["TWILIO_ACCOUNT_SID"],
    apiAuthToken: process.env["TWILIO_AUTH_TOKEN"],
    myNumber: process.env["TWILIO_MY_NUMBER"],
  },
  authSecret: process.env["AUTH_SECRET"] || "secret",
  serverAddress: process.env["SERVER_ADDRESS"] || "http://localhost:5000/",
  redisServerAddress: process.env["REDIS_SERVER"] || "redis://localhost:6379",
  razorpayKeys: {
    keyId: process.env["RAZORPAY_KEY_ID"] || "key id not found",
    keySecret: process.env["RAZORPAY_KEY_SECRET"] || "key secret not found",
  },
};

