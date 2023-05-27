require('dotenv').config()
import * as express from 'express'
import { Request, Response, Express } from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import { uploads } from './middlewares/multer';
import { createSeller, getSellers, deleteSellerById, updateSellerById } from './controllers/seller.controller';
import { createProduct, getProducts, deleteProductById } from './controllers/product.controller';
import { signUp, login, forgotPassword, resetPassword, verifyUser } from './controllers/user.controller';
import { validateOtp, createOtp, resendOtp } from './controllers/otp.controller';
import { createOrder } from './controllers/order.controller';
import { authenticate } from './middlewares/auth';


const app: Express = express();
const port: number = 5000;


// --------------------------------------------------------



app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

app.get('/status', async (req: Request, res: Response) => {
    // res.status(200).json({msg:'GET request received'});
    // const prisma = new PrismaClient()
    // const record = await prisma.user.findMany()
    // console.log(record)
    // console.log('node server is running')

    // const redisClient = await getRedis();
    // await redisClient.SET("testData", "foo");
    // var testData = await redisClient.GET("testData");
    // console.log(testData)

    res.send("Node server is running")
})

// -------------------------------------------------------

app.post('/seller', createSeller);
app.delete('/seller', deleteSellerById)
app.get('/seller', getSellers);
app.put('/seller', updateSellerById);

// for uploading single file
// app.post('/seller/:sellerId/product', uploads.single('productImage'), createProduct);
// for uploading multiple files with max number of images provided
app.post('/seller/:sellerId/product', uploads.array('productImages', 6), createProduct);

app.get('/products', getProducts);
app.delete('/products', deleteProductById);

app.post('/otp', createOtp)
app.post('/validateotp', validateOtp)
app.post('/resendotp', resendOtp)

app.post('/auth/signup', signUp)
app.get('/auth/signup/verify', authenticate, verifyUser)
app.post('/auth/login', login)
app.post('/auth/forgotpassword', forgotPassword);
app.post('/auth/resetpassword', authenticate, resetPassword);

app.post('/order', createOrder)

// -----------------------------------------------------

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

