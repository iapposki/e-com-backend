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
exports.updateSellerById = exports.deleteSellerById = exports.getSellers = exports.createSeller = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Initializing Seller cration...");
    try {
        const { name, email, gstNumber, phoneNumber } = req.body;
        yield prisma.seller.create({
            data: {
                name, email, gstNumber, phoneNumber
            }
        });
        // res.send("Seller created successfully");
        res.status(200).json({ msg: 'Seller added successfully' });
        console.log("Seller created successfully");
    }
    catch (err) {
        // logger.error(err.stack)
        console.log(err);
        res.status(400).json({ msg: 'Error while adding Seller' });
    }
});
exports.createSeller = createSeller;
const getSellers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma.seller.findMany({});
        res.status(200).json({ msg: 'Success', data: response });
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({ msg: 'Error while fetching sellers' });
    }
});
exports.getSellers = getSellers;
const deleteSellerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        yield prisma.seller.delete({
            where: {
                id: id
            }
        });
        // console.log(id);
        res.status(200).json({ msg: 'Successfully deleted seller with id ' + id });
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({ msg: 'Error while deleting seller' });
    }
});
exports.deleteSellerById = deleteSellerById;
const updateSellerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, newId, name, email, gstNumber, phoneNumber } = req.body;
        yield prisma.seller.update({
            where: {
                id: id,
            },
            data: {
                name, email, gstNumber, phoneNumber
            }
        });
        res.status(200).json({ msg: 'Successfully updated seller with id ' + id });
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({ msg: 'Error while updating seller' });
    }
});
exports.updateSellerById = updateSellerById;
