const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const {authSecret} = require('../config');

const generateToken = async (name, email, role) => {
    const token = jwt.sign({name, email, role}, authSecret, {expiresIn: '24h'});
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

module.exports = {
    createUser,
    validateUsernamePassword
}