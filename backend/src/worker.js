import { connectDB } from "./config/db.js";
import { connectRedis } from "./config/redis.js";

async function startWorker() {
    await connectDB();
    await connectRedis();

    await import("./workers/analytics.worker.js");

    console.log("🚀 Analytics Worker Started");
}

startWorker();