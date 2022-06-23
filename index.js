require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer')
const {createSeller, getSellers, deleteSellerById, updateSellerById} = require('./controllers/seller.controller');
const {createProduct, getProducts, deleteProductById} = require('./controllers/product.controller');
const {signUp, login, forgotPassword, resetPassword, verifyUser} = require('./controllers/user.controller');
const {createOTP, validateOtp, createOtp, resendOtp} = require('./controllers/otp.controller');
const {createOrder} = require('./controllers/order.controller');
const {authenticate} = require('./middlewares/auth');
const app = express();
const port = 3000;


// --------------------------------------------------------

// multer

// const uploads = multer({dest: 'public/productImages/'});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/productImages/')
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1000000000);
        cb(null, file.originalname + '-' + uniqueSuffix);
    }
})
const uploads = multer({storage: storage})

// --------------------------------------------------------

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors());

app.get('/status', (req, res) => {
    // res.status(200).json({msg:'GET request received'});
    res.send("Node server is running")
})

// -------------------------------------------------------

app.post('/seller', authenticate, createSeller);
app.delete('/seller', deleteSellerById)
app.get('/seller', getSellers);
app.put('/seller', updateSellerById);

// for uploading single file
// app.post('/seller/:sellerId/product', uploads.single('productImage'), createProduct);
// for uploading multiple files with max number of images provided
app.post('/seller/:sellerId/product', uploads.array('productImages', 6), createProduct);

app.get('/products', getProducts);
app.delete('/product', deleteProductById);
 
app.post('/otp', createOtp)
app.post('/validateotp', validateOtp)
app.post('/resendotp', resendOtp)

app.post('/auth/signup', signUp)
app.post('/auth/signup/verify', authenticate, verifyUser)
app.post('/auth/login', login)
app.post('/auth/forgotpassword', forgotPassword);
app.post('/auth/resetpassword', authenticate, resetPassword);

app.post('/order', createOrder)

// -----------------------------------------------------

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})

