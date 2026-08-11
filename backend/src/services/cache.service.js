import { redisClient } from "../config/redis.js";
import { env } from "../config/env.js";
import { randomUUID } from "crypto";
import { computeUrlCacheTtlSeconds } from "../utils/cache.util.js";

const URL_PREFIX = "url:";

class CacheService {
    buildUrlKey(shortCode) {
        return `${URL_PREFIX}${shortCode}`;
    }

    async cacheUrl(url) {
        return this.setUrl(
            url.shortCode,
            {
                _id: url._id,
                url: url.longUrl,
                status: url.status,
                expiresAt: url.expiresAt,
            },
            url.expiresAt
        );
    }

    async setUrl(shortCode, data, expiresAt) {
        const key = this.buildUrlKey(shortCode);
        const ttlSeconds = computeUrlCacheTtlSeconds(
            expiresAt,
            Date.now(),
            Number(env.REDIS_URL_CACHE_TTL)
        );

        if (ttlSeconds !== null && ttlSeconds <= 0) {
            await redisClient.del(key);
            return;
        }

        await redisClient.set(
            key,
            JSON.stringify(data),
            {
                ...(ttlSeconds ? { EX: ttlSeconds } : {}),
            }
        );
    }

    buildResolveLockKey(shortCode) {
        return `${URL_PREFIX}lock:${shortCode}`;
    }

    async acquireResolveLock(shortCode, ttlMs = 3000) {
        const key = this.buildResolveLockKey(shortCode);
        const token = randomUUID();

        const acquired = await redisClient.set(key, token, {
            NX: true,
            PX: ttlMs,
        });

        return acquired ? token : null;
    }

    async releaseResolveLock(shortCode, token) {
        if (!token) {
            return;
        }

        const key = this.buildResolveLockKey(shortCode);
        const current = await redisClient.get(key);

        if (current === token) {
            await redisClient.del(key);
        }
    }

    async waitForUrl(shortCode, attempts = 5, delayMs = 50) {
        for (let attempt = 0; attempt < attempts; attempt += 1) {
            const url = await this.getUrl(shortCode);

            if (url) {
                return url;
            }

            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }

        return null;
    }


    async getUrl(shortCode) {
        const key = this.buildUrlKey(shortCode);

        const value = await redisClient.get(key);

        if (!value) {
            return null;
        }

        const url = JSON.parse(value);

        if (!url.expiresAt && url.exp) {
            url.expiresAt = url.exp;
        }

        return url;
    }

    async deleteUrl(shortCode) {
        const key = this.buildUrlKey(shortCode);

        await redisClient.del(key);
    }
}

export default new CacheService();