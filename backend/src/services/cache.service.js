import { redisClient } from "../config/redis.js";
import {env} from "../config/env.js";

const URL_PREFIX = "url:";

class CacheService {
    buildUrlKey(shortCode) {
        return `${URL_PREFIX}${shortCode}`;
    }

    async setUrl(shortCode, data) {
        const key = this.buildUrlKey(shortCode);

        await redisClient.set(
            key,
            JSON.stringify(data),
            {
                EX: Number(env.REDIS_URL_CACHE_TTL),
            }
        );
    }


    async getUrl(shortCode) {
        const key = this.buildUrlKey(shortCode);

        const value = await redisClient.get(key);

        if (!value) {
            return null;
        }

        return JSON.parse(value);
    }

    async deleteUrl(shortCode) {
        const key = this.buildUrlKey(shortCode);

        await redisClient.del(key);
    }
}

export default new CacheService();