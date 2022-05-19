const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const createSeller = async (req, res) => {
    console.log("Initializing Seller cration...")
    // console.log(res);
    // for (var i in res){
    //     console.log(i)
    // }
    try {
        const {name, email, gstNumber, phoneNumber} = req.body;
        await prisma.seller.create({
            data:{
                name, email, gstNumber, phoneNumber
            }
        });
        // res.send("Seller created successfully");
        res.status(200).json({msg:'Seller added successfully'});
    } catch (err) {
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


module.exports = {
    createSeller,
    getSellers,
    deleteSellerById,
};