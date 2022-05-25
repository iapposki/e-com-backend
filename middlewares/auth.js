const jwt = require('jsonwebtoken');
const {authSecret} = require('../config');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    // authHeader will look like : Bearer <token>
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {return res.status(401).json({msg: 'Unauthorized'})}
    try {
        const {name, email, role} = jwt.verify(token, authSecret)
        // console.log(resp)
        req.userDetails = {name, email, role}
        next();
    } catch (error) {
        console.log(error.stack)
        res.status(401).json({msg: 'Unauthorized'})
    }
}

module.exports = {authenticate}