const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createProduct = async (req, res) => {
    console.log("Initializing Product cration...")
    const {sellerId} = req.params;
    try {
        const { name, price, description, image = [], 
            discountedPrice, isDiscounted, category, inStock
            } = req.body;
        
        await prisma.seller.update({
            where: {
            id: parseInt(sellerId)
            }, data: {
            productsList: {create: [
            {
                name, price, description, image,
                discountedPrice, isDiscounted, category, inStock,
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
    try {
        const response = await prisma.product.findMany({})
        res.status(200).json({msg : 'Success', data : response});
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while fetching Products'});
    }
}

const deleteProductById = async (req, res) => {
    try {
        const {id} = req.body;
        await prisma.product.delete({
            where: {
                id : id
            }
        });
        // console.log(id);
        res.status(200).json({msg : 'Successfully deleted Product with id ' + id});
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while deleting Product'});
    }
}

const updateProductById = async (req, res) => {
    try {
        const {id, newId, name, email, gstNumber, phoneNumber} = req.body;
        await prisma.product.update({
            where: {
                id : id,
            },
            data : {
                name, email, gstNumber, phoneNumber
            }
        });
        res.status(200).json({msg : 'Successfully updated Product with id ' + id});
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while updating Product'});
    }

}

// const patchProductById = async (req, res) => {
//     try {
//         const {id, name, email, gstNumber, phoneNumber} = req.body;

//     }
// }

module.exports = {
    createProduct,
    getProducts,
    deleteProductById,
    updateProductById
};