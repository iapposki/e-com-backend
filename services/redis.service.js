const { createClient } = require('redis');
const {redisServerAddress} = require('../config');

let redisClient = null;

const getRedis = async () => {
    if (!redisClient){
        redisClient = createClient({url: redisServerAddress});
        redisClient.on('error', (err) => console.log('Redis Client Error', err))
        await redisClient.connect();
        return redisClient;
    }
    return redisClient;
}

// await client.set('key', 'value');
// const value = await client.get('key');

module.exports = {getRedis};