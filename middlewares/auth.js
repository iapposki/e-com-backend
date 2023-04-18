const jwt = require('jsonwebtoken');
const { authSecret } = require('../config');
const { getRedis } = require('../services/redis.service');
const { generateToken } = require('../services/user.service');

const authenticate = async (req, res, next) => {
    var { at = "", rt = "" } = req.query;
    if (!at) {
        const atAuthHeader = req.headers['at'];
        // authHeader will look like : Bearer <token>
        // var token = authHeader && authHeader.split(' ')[1];
        var at = atAuthHeader && atAuthHeader.split(' ')[1];
    }
    if (!rt) {
        const rtAuthHeader = req.headers['rt'];
        var rt = rtAuthHeader && rtAuthHeader.split(' ')[1];
    }
    // console.log(token)
    if (!at || !rt) { return res.status(401).json({ msg: `${(!at) ? 'Access token not provided' : 'Refresh token not provided'}` }) }
    try {
        const { name, email, role } = jwt.verify(at, authSecret)
        // console.log(resp)
        req.userDetails = { name, email, role }
        console.log('ok')
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // console.log('access token has expired.')
            try {
                const { name, email, role } = jwt.verify(rt, authSecret)
                const redisClient = await getRedis()
                var rtRedis = await redisClient.GET('rt-' + email)
                if (rtRedis !== rt) {
                    throw new Error("Refresh token is invalid")
                }
                // console.log('ooof')
                try {
                    req.userDetails = { name, email, role }
                    const rt = await generateToken(name, email, role, expiry = "7d")
                    await redisClient.set("rt-" + email, rt, {
                        EX: 604800
                    })
                    const at = await generateToken(name, email, role)
                    const oldResJson = res.json
                    res.json = function (data) {
                        data.at = at
                        data.rt = rt
                        res.json = oldResJson
                        return res.json(data)
                    }
                    // res.rt = token
                    next()

                } catch (error1) {
                    console.log(error1)
                    res.status(401).json({ msg: 'Unauthorized.' })
                }
            } catch (error2) {
                if (error2.name === 'TokenExpiredError') {
                    res.status(401).json({ msg: 'Unauthorized, refresh token has expired. Please login again' })
                } else {
                    res.status(401).json({ msg: "Unauthorized, refresh token is invalid." })
                }
            }
        } else {
            console.log(error.stack)
            res.status(401).json({ msg: 'Unauthorized' })
        }
    }
}

module.exports = { authenticate }