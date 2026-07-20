import app from "./app.js";

import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import redisCounterService from "./services/redis-counter.service.js";
const startServer = async () => {
    try {
        await connectDB();

        await connectRedis();

        await redisCounterService.initializeCounter();

        app.listen(env.PORT, () => {
            console.log(`🚀 Server running on ${env.PORT}`);
        });
    } catch (err) {
        console.error(err);

        process.exit(1);
    }
};

startServer();