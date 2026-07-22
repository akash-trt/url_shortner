import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../config/redis.js";

const createRateLimiter = ({
    windowMs,
    max,
    prefix,
    keyGenerator,
}) =>
    rateLimit({
        windowMs,
        max,

        standardHeaders: true,
        legacyHeaders: false,

        message: {
            success: false,
            message: "Too many requests. Please try again later.",
        },

        store: new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix,
        }),

        keyGenerator,
    });

export const loginLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 5,
    prefix: "login:",
});

export const registerLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 3,
    prefix: "register:",
});

export const createUrlLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 20,
    prefix: "create-url:",
    keyGenerator: req => req.user.id,
});

export const redirectLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    max: 100,
    prefix: "redirect:",
});