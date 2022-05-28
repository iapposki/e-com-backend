const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const {logger} = require('../log/index');

const createSeller = async (req, res) => {
    console.log("Initializing Seller cration...")
    try {
        const {name, email, gstNumber, phoneNumber} = req.body;
        await prisma.seller.create({
            data:{
                name, email, gstNumber, phoneNumber
            }
        });
        // res.send("Seller created successfully");
        res.status(200).json({msg:'Seller added successfully'});
        console.log("Seller created successfully");
    } catch (err) {
        logger.error(err.stack)
        // console.log(err); 
        res.status(400).json({msg:'Error while adding Seller'});
    }
}

const getSellers = async (req, res) => {
    try {
        const response = await prisma.seller.findMany({})
        res.status(200).json({msg : 'Success', data : response});
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while fetching sellers'});
    }
}

const deleteSellerById = async (req, res) => {
    try {
        const {id} = req.body;
        await prisma.seller.delete({
            where: {
                id : id
            }
        });
        // console.log(id);
        res.status(200).json({msg : 'Successfully deleted seller with id ' + id});
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while deleting seller'});
    }
}

const updateSellerById = async (req, res) => {
    try {
        const {id, newId, name, email, gstNumber, phoneNumber} = req.body;
        await prisma.seller.update({
            where: {
                id : id,
            },
            data : {
                name, email, gstNumber, phoneNumber
            }
        });
        res.status(200).json({msg : 'Successfully updated seller with id ' + id});
    } catch (err) {
        // console.log(err)
        res.status(400).json({msg : 'Error while updating seller'});
    }

}


module.exports = {
    createSeller,
    getSellers,
    deleteSellerById,
    updateSellerById
};