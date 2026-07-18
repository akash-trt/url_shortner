import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { redisClient } from "./config/redis.js";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth",authRoutes);

app.use(errorHandler);

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