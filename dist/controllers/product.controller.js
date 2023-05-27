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
exports.deleteProductById = exports.getProducts = exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const config_1 = require("../config");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Initializing Product cration...");
    const { sellerId } = req.params;
    var imageFileDestinations = [];
    if (req.files) {
        for (var file of req.files) {
            imageFileDestinations.push(config_1.config.serverAddress + file.destination.split('/').slice(1).join("/") + file.filename);
        }
        console.log(req.files);
    }
    try {
        var { name, price, description, image = [], discountedPrice, isDiscounted, category, inStock } = req.body;
        yield prisma.seller.update({
            where: {
                id: parseInt(sellerId)
            }, data: {
                productsList: {
                    create: [
                        {
                            name, price: parseInt(price), description, image: imageFileDestinations,
                            discountedPrice: parseInt(discountedPrice), isDiscounted: isDiscounted === 'true', category, inStock: inStock === 'true',
                        }
                    ]
                }
            }
        });
        res.status(200).json({ msg: 'Product added successfully for seller with id ' + sellerId });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while adding Product' });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'asc', search = "" } = req.query;
    // console.log(`limit: ${limit} offset: ${offset}`);
    try {
        if (!search) {
            const response = yield prisma.product.findMany({});
            res.status(200).json({ msg: 'Success', data: response });
        }
        else {
            const response = yield prisma.product.findMany({
                where: {
                    OR: [
                        {
                            description: {
                                search: String(search)
                            }
                        }, {
                            name: {
                                search: String(search)
                            }
                        }
                    ]
                },
                skip: Number(offset),
                take: Number(limit),
                orderBy: {
                    [sortBy.toString()]: sortOrder
                },
            });
            res.status(200).json({ msg: 'Success', data: response });
        }
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({ msg: 'Error while fetching Products' });
    }
});
exports.getProducts = getProducts;
const deleteProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        for (var singularID of id) {
            yield prisma.product.delete({
                where: {
                    id: singularID
                }
            });
            // console.log(id);
        }
        res.status(200).json({ msg: 'Successfully deleted Product with id(s) ' + id });
    }
    catch (err) {
        // console.log(err)
        res.status(400).json({ msg: 'Error while deleting Product' });
    }
});
exports.deleteProductById = deleteProductById;
