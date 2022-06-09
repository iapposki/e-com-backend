const nodemailer = require('nodemailer');

let testAccount;
let transporter;

(async () => {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })
})();

const sendEmail = async({to, subject, text, html}) => {
    const info = await transporter.sendMail({
        from: "testmail@email.com",
        to, subject, text, html
    })
    console.log("Message sent : ", info.messageId);
    console.log("You can Preview it here : ", nodemailer.getTestMessageUrl(info));
}

module.exports = sendEmail;