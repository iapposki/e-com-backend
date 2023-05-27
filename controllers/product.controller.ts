import { PrismaClient, Product } from "@prisma/client";
const prisma = new PrismaClient();
import { config } from '../config'
import { Request, Response } from "express";

export const createProduct = async (req: Request, res: Response) => {
    console.log("Initializing Product cration...")
    const { sellerId } = req.params;
    var imageFileDestinations = [];
    if (req.files) {
        for (var file of (req.files as Express.Multer.File[])) {
            imageFileDestinations.push(config.serverAddress + file.destination.split('/').slice(1).join("/") + file.filename);
        }
        console.log(req.files);
    }
    try {
        var { name, price, description, image = [],
            discountedPrice, isDiscounted, category, inStock
        } = req.body;
        await prisma.seller.update({
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
        }
        );
        res.status(200).json({ msg: 'Product added successfully for seller with id ' + sellerId });
    } catch (err) {
        console.log(err);
        res.status(400).json({ msg: 'Error while adding Product' });
    }
}

export const getProducts = async (req: Request, res: Response) => {
    const { limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'asc', search = "" } = req.query;
    // console.log(`limit: ${limit} offset: ${offset}`);
    try {
        if (!search) {
            const response = await prisma.product.findMany({});
            res.status(200).json({ msg: 'Success', data: response });
        } else {
            const response: Array<Product> = await prisma.product.findMany({
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
            })
            res.status(200).json({ msg: 'Success', data: response });
        }
    } catch (err) {
        // console.log(err)
        res.status(400).json({ msg: 'Error while fetching Products' });
    }
}

export const deleteProductById = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        for (var singularID of id) {
            await prisma.product.delete({
                where: {
                    id: singularID
                }
            });
            // console.log(id);
        }
        res.status(200).json({ msg: 'Successfully deleted Product with id(s) ' + id });
    } catch (err) {
        // console.log(err)
        res.status(400).json({ msg: 'Error while deleting Product' });
    }
}