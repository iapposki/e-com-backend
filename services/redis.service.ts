import { createClient } from "redis";
import { config } from "../config"


let redisClient: ReturnType<typeof createClient> | undefined;

export const getRedis = async () => {
    if (!redisClient) {
        redisClient = createClient({ url: config.redisServerAddress });
        redisClient.on('error', (err: Error) => console.log('Redis Client Error', err))
        await redisClient.connect();
        return redisClient;
    }
    return redisClient;
}

// await client.set('key', 'value');
// const value = await client.get('key');

