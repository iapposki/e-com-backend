import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { Request, Response } from "express";
import Razorpay = require("razorpay");

export const createOrder = async (req: Request, res: Response) => {
    const { productIds, userId } = req.body;
    console.log('Creating order for user with user ID: ', userId);
    const products = await prisma.product.findMany({
        where: {
            id: { in: productIds }
        }
    });
    var total = 0;
    for (var product of products) {
        if (product.isDiscounted) {
            total += product.discountedPrice ? product.discountedPrice : 0;
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

    res.status(200).json({ status: 'success', total, msg: 'Order created successfully' });

}

