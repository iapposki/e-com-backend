const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const rzp = require('../services/razorpay.service');

const createOrder = async (req, res) => {
    const {productIds, userId} = req.body;
    console.log('Creating order for user with user ID: ', userId);
    const products = await prisma.product.findMany({
        where: {
            id: {in: productIds}
        }
    });
    var total = 0;
    for (product of products) {
        if (product.isDiscounted){
            total += product.discountedPrice;
        } else {
        total += product.price;
        }
    }
    
    console.log(total)
    const order = await prisma.order.create({
        data: {
            total: total, productIds, userId: parseInt(userId),   
        }
    })
    console.log(order);

    let rzpOrder;
    try {
        rzpOrder = await rzp.orders.create({
            amount: total, // amount in the smallest currency unit, or whatever chosen
            currency: 'INR',
            receipt: order.id,
        }) 
    }catch (err) {
        console.log(err);
    }
    
    console.log(rzpOrder, 'rzp');
    const {id : rzpId, amount, receipt} = rzpOrder;
    res.status(200).json({status : 'success', rzpId, amount, receipt, msg : 'Order created successfully'});
    
}

module.exports = {
    createOrder
}