import { env } from "../config/env.js";

export const redisConnection = {
    url: env.REDIS_URL,
};