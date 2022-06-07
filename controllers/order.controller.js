const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

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
    await prisma.order.create({
        data: {
            total: total, productIds, userId: parseInt(userId),   
        }
    })
    // console.log(order);
    res.status(200).json({msg: 'Order created'});
    
}

module.exports = {
    createOrder
}