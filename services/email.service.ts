// const nodemailer = require('nodemailer');
import * as nodemailer from 'nodemailer'

let testAccount: any;
let transporter: any;
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

type EmailObject = {
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const sendEmail = async (obj: EmailObject) => {
    const info = await transporter.sendMail({
        from: "testmail@email.com",
        ...obj
    })
    console.log("Message sent : ", info.messageId);
    console.log("You can Preview it here : ", nodemailer.getTestMessageUrl(info));
}
