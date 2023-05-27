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
exports.createOrder = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productIds, userId } = req.body;
    console.log('Creating order for user with user ID: ', userId);
    const products = yield prisma.product.findMany({
        where: {
            id: { in: productIds }
        }
    });
    var total = 0;
    for (var product of products) {
        if (product.isDiscounted) {
            total += product.discountedPrice ? product.discountedPrice : 0;
        }
        else {
            total += product.price;
        }
    }
    console.log(total);
    const order = yield prisma.order.create({
        data: {
            total: total, productIds, userId: parseInt(userId),
        }
    });
    console.log(order);
    res.status(200).json({ status: 'success', total, msg: 'Order created successfully' });
});
exports.createOrder = createOrder;
