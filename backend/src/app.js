import express from "express";
import mongoose from "mongoose";
import { redisClient } from "./config/redis.js";

const app = express();

app.get("/health", (req, res) => {
    const mongo =
        mongoose.connection.readyState === 1 ? "UP" : "DOWN";

    const redis =
        redisClient.isReady ? "UP" : "DOWN";

    res.json({
        status: "UP",
        services: {
            mongo,
            redis
        }
    });
});

export default app;