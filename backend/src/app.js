import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { redisClient } from "./config/redis.js";
import authRoutes from "./routes/auth.routes.js";
import urlRoutes from "./routes/url.routes.js";
import redirectRoutes from "./routes/redirect.routes.js";
import errorHandler from "./middleware/error.middleware.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use((req, res, next) => {
    console.log("Incoming:", req.method, req.originalUrl);
    next();
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/urls", urlRoutes);
app.use("/", redirectRoutes);

app.use(errorHandler);

export default app;