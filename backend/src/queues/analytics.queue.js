import { Queue } from "bullmq";
import { redisConnection } from "./queue.connection.js";

export const analyticsQueue = new Queue(
    "analytics",
    {
        connection: redisConnection,
        defaultJobOptions: {
            attempts: 3,

            backoff: {
                type: "exponential",
                delay: 1000,
            },

            removeOnComplete: true,

            removeOnFail: false,
        },
    }
);