const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const {createSeller, getSellers, deleteSellerById, updateSellerById} = require('./controllers/seller.controller');
const {createProduct, getProducts, deleteProductById} = require('./controllers/product.controller');
const {signUp, login} = require('./controllers/user.controller');
const {createOTP} = require('./controllers/otp.controller');
const { json } = require('express/lib/response');
// const res = require('express/lib/response');
// const request = require('express/lib/request');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())
app.use(cors());

app.get('/status', (req, res) => {
    // res.status(200).json({msg:'GET request received'});
    res.send("Node server is running")
})

app.post('/seller', createSeller);
app.delete('/seller', deleteSellerById)
app.get('/seller', getSellers);
app.put('/seller', updateSellerById);

app.post('/seller/:sellerId/product', createProduct);
app.get('/products', getProducts);
app.delete('/product', deleteProductById);
 
app.post('/otp', createOTP)

app.post('/auth/signup', signUp)
app.post('/auth/login', login)

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})

