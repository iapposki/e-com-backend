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
exports.getRedis = void 0;
const redis_1 = require("redis");
const config_1 = require("../config");
let redisClient;
const getRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!redisClient) {
        redisClient = (0, redis_1.createClient)({ url: config_1.config.redisServerAddress });
        redisClient.on('error', (err) => console.log('Redis Client Error', err));
        yield redisClient.connect();
        return redisClient;
    }
    return redisClient;
});
exports.getRedis = getRedis;
// await client.set('key', 'value');
// const value = await client.get('key');
