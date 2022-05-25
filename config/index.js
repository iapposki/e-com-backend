const config = {
    postgresURL : process.env["DATABASE_URL"] || "postgres://postgres:password@localhost:5432/mydb",
    twilio : {
        apiSID : process.env["TWILIO_ACCOUNT_SID"],
        apiAuthToken : process.env["TWILIO_AUTH_TOKEN"],
        myNumber : process.env["TWILIO_MY_NUMBER"],
    },
    authSecret : process.env["AUTH_SECRET"] || "secret",
}

module.exports = config;
