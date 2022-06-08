const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const {authSecret} = require('../config');

const generateToken = async (name, email, role, expiry='24h') => {
    const token = jwt.sign({name, email, role}, authSecret, {expiresIn: expiry});
    return token
}

const createUser = async (userDetails) => {
    await prisma.user.create({data: {...userDetails, role : 'USER', password : md5(userDetails.password)}})
    const token = await generateToken(userDetails.name, userDetails.email, 'USER')
    return token
}

const validateUsernamePassword = async (email, password) => {
    const user = await prisma.user.findFirst({where: {email : email,}})
    if (user) {
        const token = await generateToken(user.name, user.email, user.role)
        return {pass : user.password === md5(password), token : token}
    }
    return false
}

const getUserByEmail = async (email) => {
    const record = await prisma.user.findFirst({where: {email : email,}})
    return record;
};

const updatePassword = async (email, password) => {
    await prisma.user.update({
        where: {email: email},
        data: {password: md5(password)}
    })
}


module.exports = {
    createUser,
    validateUsernamePassword,
    getUserByEmail,
    generateToken,
    updatePassword
}