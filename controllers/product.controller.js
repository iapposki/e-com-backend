const {PrismaClient} = require('@prisma/client');
const { json } = require('express/lib/response');
const prisma = new PrismaClient();
const {serverAddress} = require('../config/index');

const createProduct = async (req, res) => {
    console.log("Initializing Product cration...")
    const {sellerId} = req.params;
    imageFileDestinations = [];
    if (req.files){
        for (file of req.files) {
            imageFileDestinations.push(serverAddress + file.destination.split('/').slice(1).join("/") + file.filename);
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
            productsList: {create: [
            {
                name, price: parseInt(price), description, image: imageFileDestinations,
                discountedPrice: parseInt(discountedPrice), isDiscounted: isDiscounted === 'true', category, inStock: inStock === 'true',
            }
            ]
        }}}
        );
        res.status(200).json({msg:'Product added successfully for seller with id ' + sellerId});
    } catch (err) {
        console.log(err); 
        res.status(400).json({msg:'Error while adding Product'});
    }
}

const getProducts = async (req, res) => {
    const {limit = 10, offset = 0, sortBy = 'createdAt', sortOrder = 'asc', search=""} = req.query;
    console.log(`limit: ${limit} offset: ${offset}`);
    try {
        if (!search) {
            const response = await prisma.product.findMany({});
            res.status(200).json({msg : 'Success', data : response});
        } else {
            const response = await prisma.product.findMany({
                where : {
                    OR: [
                        {
                            description : {
                                search : search
                            }
                        },{
                            name : {
                                search : search
                            }
                        }
                    ]
                    
                },
                skip : parseInt(offset),
                take : parseInt(limit),
                orderBy : {
                    [sortBy] : sortOrder
                },
            })
            res.status(200).json({msg : 'Success', data : response});
        }
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while fetching Products'});
    }
}

const deleteProductById = async (req, res) => {
    try {
        const {id} = req.body;
        for (singularID of id) {
            await prisma.product.delete({
                where: {
                    id : singularID
                }
            });
            // console.log(id);
        }
        res.status(200).json({msg : 'Successfully deleted Product with id(s) ' + id});
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while deleting Product'});
    }
}

module.exports = {
    createProduct,
    getProducts,
    deleteProductById,
};