const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const { authSecret } = require('../config');
const { getRedis } = require('./redis.service');

const generateToken = async (name, email, role, expiry = 300, randomNumber = Math.random()) => {
    const token = jwt.sign({ name, email, role, randomNumber }, authSecret, { expiresIn: expiry });
    return token
}

const createUser = async (userDetails) => {
    await prisma.user.create({ data: { ...userDetails, role: 'USER', password: md5(userDetails.password) } })
    const at = await generateToken(userDetails.name, userDetails.email, 'USER')
    const rt = await generateToken(userDetails.name, userDetails.email, 'USER', expiry = '7d')
    const redisClient = await getRedis()
    await redisClient.SET("rt-" + userDetails.email, rt, {
        EX: 604800
    })
    const tokens = { at, rt }
    return tokens
}

const validateUsernamePassword = async (email, password) => {
    const user = await prisma.user.findFirst({ where: { email: email, } })
    if (user && user.password === md5(password)) {
        const at = await generateToken(user.name, email, user.role)
        const rt = await generateToken(user.name, email, user.role, expiry = '7d')
        const redisClient = await getRedis()
        await redisClient.set("rt-" + email, rt, {
            EX: 604800
        })
        const tokens = { at, rt }
        return { pass: true, tokens: tokens }
    }
    return false
}

const getUserByEmail = async (email) => {
    const record = await prisma.user.findFirst({ where: { email: email, } })
    return record;
};

const updatePassword = async (email, password) => {
    await prisma.user.update({
        where: { email: email },
        data: { password: md5(password) }
    })
}

const toggleVerification = async (email, isVerified) => {
    await prisma.user.update({
        where: { email: email },
        data: { isVerified: !isVerified }
    })
}

module.exports = {
    createUser,
    validateUsernamePassword,
    getUserByEmail,
    generateToken,
    updatePassword,
    toggleVerification
}