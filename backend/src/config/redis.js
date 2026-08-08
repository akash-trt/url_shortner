import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = createClient({
    url: env.REDIS_URL
});

redisClient.on("connect", () => {
    console.log("✅ Redis Connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis Error:", err.message);
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (err) {
        console.error("Redis connection failed");
        process.exit(1);
    }
};