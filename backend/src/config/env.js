// src/config/env.js

import dotenv from "dotenv";

dotenv.config();

const requiredEnv = [
    "PORT",
    "MONGO_URI",
    "REDIS_URL",
    "JWT_SECRET",
    "BASE_URL"
];

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing environment variable: ${key}`);
    }
}

export const env = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    REDIS_URL: process.env.REDIS_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    BASE_URL: process.env.BASE_URL
};