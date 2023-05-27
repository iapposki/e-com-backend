"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt = require("jsonwebtoken");
const config_1 = require("../config");
const redis_service_1 = require("../services/redis.service");
const user_service_1 = require("../services/user.service");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var { at = "", rt = "" } = req.query;
    var tempAt = at;
    var tempRt = rt;
    if (!at) {
        const atAuthHeader = req.headers["at"];
        // authHeader will look like : Bearer <token>
        // var token = authHeader && authHeader.split(' ')[1];
        tempAt = atAuthHeader && atAuthHeader.split(" ")[1];
    }
    if (!rt) {
        const rtAuthHeader = req.headers["rt"];
        tempRt = rtAuthHeader && rtAuthHeader.split(" ")[1];
    }
    // console.log(token)
    if (!at || !rt) {
        return res
            .status(401)
            .json({
            msg: `${!at ? "Access token not provided" : "Refresh token not provided"}`,
        });
    }
    try {
        const { name, email, role } = jwt.verify(tempAt, config_1.config.authSecret);
        // console.log(resp)
        if (req.userDetails) {
            throw new Error("Someone tried to hack.");
        }
        req.userDetails = { name, email, role };
        console.log("ok");
        next();
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            // console.log('access token has expired.')
            try {
                const { name, email, role } = jwt.verify(tempRt, config_1.config.authSecret);
                const redisClient = yield (0, redis_service_1.getRedis)();
                var rtRedis = yield redisClient.GET("rt-" + email);
                if (rtRedis !== tempRt) {
                    throw new Error("Refresh token is invalid");
                }
                // console.log('ooof')
                try {
                    req.userDetails = { name, email, role };
                    const rt = yield (0, user_service_1.generateToken)(name, email, role, "7d");
                    yield redisClient.set("rt-" + email, rt, {
                        EX: 604800,
                    });
                    const at = yield (0, user_service_1.generateToken)(name, email, role);
                    const oldResJson = res.json;
                    res.json = function (data) {
                        data.at = at;
                        data.rt = rt;
                        res.json = oldResJson;
                        return res.json(data);
                    };
                    // res.rt = token
                    next();
                }
                catch (error1) {
                    console.log(error1);
                    res.status(401).json({ msg: "Unauthorized." });
                }
            }
            catch (error2) {
                if (error2.name === "TokenExpiredError") {
                    res
                        .status(401)
                        .json({
                        msg: "Unauthorized, refresh token has expired. Please login again",
                    });
                }
                else {
                    res
                        .status(401)
                        .json({ msg: "Unauthorized, refresh token is invalid." });
                }
            }
        }
        else {
            console.log(error.stack);
            res.status(401).json({ msg: "Unauthorized" });
        }
    }
});
exports.authenticate = authenticate;
