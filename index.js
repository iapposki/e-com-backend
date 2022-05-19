const express = require('express');
const bodyParser = require('body-parser');
const {createSeller, getSellers, deleteSellerById, updateSellerById} = require('./controllers/seller.controller');
const {createProduct, getProducts} = require('./controllers/product.controller');
const { json } = require('express/lib/response');
// const res = require('express/lib/response');
// const request = require('express/lib/request');
const app = express();
const port = 3000;

// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})

