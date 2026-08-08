// import { redisClient } from "../config/redis.js";
// import { encodeBase62, decodeBase62 } from "../lib/base62.js";
// import urlRepository from "../repositories/url.repository.js";

// const COUNTER_KEY = "url:counter:global";

// class RedisCounterService {

//     /**
//      * Initialize Redis counter.
//      * Called only once during application startup.
//      */
//     async initializeCounter() {

//         const exists = await redisClient.exists(COUNTER_KEY);

//         if (exists) {
//             console.log("✅ Redis counter already initialized.");
//             return;
//         }

//         console.log("Initializing Redis counter...");

//         const latestUrl = await urlRepository.findLatest();

//         if (!latestUrl) {

//             await redisClient.set(
//                 COUNTER_KEY,
//                 0
//             );

//             console.log("Counter initialized to 0");

//             return;
//         }

//         const counter = decodeBase62(latestUrl.shortCode);

//         await redisClient.set(
//             COUNTER_KEY,
//             counter
//         );

//         console.log(
//             `Counter restored to ${counter}`
//         );
//     }

//     /**
//      * Returns next sequence.
//      */
//     async getNextSequence() {

//         const exists = await redisClient.exists(COUNTER_KEY);

//         if (!exists) {
//             await this.initializeCounter();
//         }

//         return await redisClient.incr(COUNTER_KEY);
//     }

// }

// export default new RedisCounterService();
import { redisClient } from "../config/redis.js";
import { encodeBase62, decodeBase62 } from "../lib/base62.js";
import urlRepository from "../repositories/url.repository.js";

const COUNTER_KEY = "url:counter:global";

class RedisCounterService {

    /**
     * Initialize Redis counter.
     * Called only once during application startup.
     */
    async initializeCounter() {
        const exists = await redisClient.exists(COUNTER_KEY);

        if (exists) {
            console.log("✅ Redis counter already initialized.");
            return;
        }

        console.log("Initializing Redis counter...");

        const latestUrl = await urlRepository.findLatest();

        if (!latestUrl) {
            await redisClient.set(COUNTER_KEY, 0);
            console.log("Counter initialized to 0");
            return;
        }

        const counter = decodeBase62(latestUrl.shortCode);

        await redisClient.set(COUNTER_KEY, counter);

        console.log(`Counter restored to ${counter}`);
    }

    /**
     * Returns the next numeric sequence.
     */
    async getNextSequence() {
        const exists = await redisClient.exists(COUNTER_KEY);

        if (!exists) {
            await this.initializeCounter();
        }

        return await redisClient.incr(COUNTER_KEY);
    }

    /**
     * Generates the next unique Base62 short code.
     */
    async generateShortCode() {
        const sequence = await this.getNextSequence();
        return encodeBase62(sequence);
    }
}

export default new RedisCounterService();