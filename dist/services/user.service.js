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
exports.toggleVerification = exports.updatePassword = exports.getUserByEmail = exports.validateUsernamePassword = exports.createUser = exports.generateToken = void 0;
const client_1 = require("@prisma/client");
const ts_md5_1 = require("ts-md5");
const jwt = require("jsonwebtoken");
const config_1 = require("../config");
const redis_service_1 = require("./redis.service");
const prisma = new client_1.PrismaClient();
const generateToken = (name, email, role, expiry = 300, randomNumber = Math.random()) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jwt.sign({ name, email, role, randomNumber }, config_1.config.authSecret, {
        expiresIn: expiry,
    });
    return token;
});
exports.generateToken = generateToken;
const createUser = (userDetails) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.create({
        data: Object.assign(Object.assign({}, userDetails), { role: "USER", password: ts_md5_1.Md5.hashStr(userDetails.password) }),
    });
    const at = yield (0, exports.generateToken)(userDetails.name, userDetails.email, "USER");
    const rt = yield (0, exports.generateToken)(userDetails.name, userDetails.email, "USER", "7d");
    const redisClient = yield (0, redis_service_1.getRedis)();
    yield redisClient.SET("rt-" + userDetails.email, rt, {
        EX: 604800,
    });
    const tokens = { at, rt };
    return tokens;
});
exports.createUser = createUser;
const validateUsernamePassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findFirst({ where: { email: email } });
    if (user && user.password === ts_md5_1.Md5.hashStr(password)) {
        const at = yield (0, exports.generateToken)(user.name, email, user.role);
        const rt = yield (0, exports.generateToken)(user.name, email, user.role, "7d");
        const redisClient = yield (0, redis_service_1.getRedis)();
        yield redisClient.set("rt-" + email, rt, {
            EX: 604800,
        });
        const tokens = { at, rt };
        return { pass: true, tokens: tokens };
    }
    return false;
});
exports.validateUsernamePassword = validateUsernamePassword;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield prisma.user.findFirst({ where: { email: email } });
    return record;
});
exports.getUserByEmail = getUserByEmail;
const updatePassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { email: email },
        data: { password: ts_md5_1.Md5.hashStr(password) },
    });
});
exports.updatePassword = updatePassword;
const toggleVerification = (email, isVerified) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.user.update({
        where: { email: email },
        data: { isVerified: !isVerified },
    });
});
exports.toggleVerification = toggleVerification;
