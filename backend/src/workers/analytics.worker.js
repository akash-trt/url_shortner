import { Worker } from "bullmq";

import { redisConnection } from "../queues/queue.connection.js";
import analyticsService from "../analytics/analytics.service.js";

const analyticsWorker = new Worker(
    "analytics",
    async (job) => {
        console.log("📦 Job Received:");
        console.log(job.data);

        switch (job.name) {
            case "track-click":
                await analyticsService.track(job.data);
                break;

            default:
                throw new Error(`Unknown job: ${job.name}`);
        }
    },
    {
        connection: redisConnection,
        concurrency: 10,
    }
);

analyticsWorker.on("completed", (job) => {
    console.log(`✅ Job ${job.id} completed`);
});

analyticsWorker.on("failed", (job, err) => {
    console.error(`❌ Job ${job?.id} failed`, err);
});

console.log("🚀 Analytics Worker Started");