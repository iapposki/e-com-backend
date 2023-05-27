"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
// const nodemailer = require('nodemailer');
const nodemailer = require("nodemailer");
let testAccount;
let transporter;
(() => __awaiter(void 0, void 0, void 0, function* () {
    testAccount = yield nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
}))();
const sendEmail = (obj) => __awaiter(void 0, void 0, void 0, function* () {
    const info = yield transporter.sendMail(Object.assign({ from: "testmail@email.com" }, obj));
    console.log("Message sent : ", info.messageId);
    console.log("You can Preview it here : ", nodemailer.getTestMessageUrl(info));
});
exports.sendEmail = sendEmail;
