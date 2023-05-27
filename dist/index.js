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
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer_1 = require("./middlewares/multer");
const seller_controller_1 = require("./controllers/seller.controller");
const product_controller_1 = require("./controllers/product.controller");
const user_controller_1 = require("./controllers/user.controller");
const otp_controller_1 = require("./controllers/otp.controller");
const order_controller_1 = require("./controllers/order.controller");
const auth_1 = require("./middlewares/auth");
const app = express();
const port = 5000;
// --------------------------------------------------------
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.get('/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // res.status(200).json({msg:'GET request received'});
    // const prisma = new PrismaClient()
    // const record = await prisma.user.findMany()
    // console.log(record)
    // console.log('node server is running')
    // const redisClient = await getRedis();
    // await redisClient.SET("testData", "foo");
    // var testData = await redisClient.GET("testData");
    // console.log(testData)
    res.send("Node server is running");
}));
// -------------------------------------------------------
app.post('/seller', seller_controller_1.createSeller);
app.delete('/seller', seller_controller_1.deleteSellerById);
app.get('/seller', seller_controller_1.getSellers);
app.put('/seller', seller_controller_1.updateSellerById);
// for uploading single file
// app.post('/seller/:sellerId/product', uploads.single('productImage'), createProduct);
// for uploading multiple files with max number of images provided
app.post('/seller/:sellerId/product', multer_1.uploads.array('productImages', 6), product_controller_1.createProduct);
app.get('/products', product_controller_1.getProducts);
app.delete('/products', product_controller_1.deleteProductById);
app.post('/otp', otp_controller_1.createOtp);
app.post('/validateotp', otp_controller_1.validateOtp);
app.post('/resendotp', otp_controller_1.resendOtp);
app.post('/auth/signup', user_controller_1.signUp);
app.get('/auth/signup/verify', auth_1.authenticate, user_controller_1.verifyUser);
app.post('/auth/login', user_controller_1.login);
app.post('/auth/forgotpassword', user_controller_1.forgotPassword);
app.post('/auth/resetpassword', auth_1.authenticate, user_controller_1.resetPassword);
app.post('/order', order_controller_1.createOrder);
// -----------------------------------------------------
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
