import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "PORT",
    "MONGO_URI",
    "REDIS_URL",
    "BASE_URL",
    "JWT_ACCESS_SECRET",
    "JWT_REFRESH_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_EXPIRY",
    "NODE_ENV",
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
});

export const env = Object.freeze({
    PORT: Number(process.env.PORT),

    NODE_ENV: process.env.NODE_ENV,

    MONGO_URI: process.env.MONGO_URI,

    REDIS_URL: process.env.REDIS_URL,
    REDIS_URL_CACHE_TTL: Number(process.env.REDIS_URL_CACHE_TTL || 86400),

    BASE_URL: process.env.BASE_URL,

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

    ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
});