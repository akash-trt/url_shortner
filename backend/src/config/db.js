// import mongoose from "mongoose";
// import { env } from "./env.js";

// export const connectDB = async () => {
//     try {
//         console.log("Using URI:", process.env.MONGO_URI?.replace(/\/\/.*:.*@/, "//<user>:<password>@"));
//         await mongoose.connect(env.MONGO_URI);

//         console.log("✅ MongoDB Connected");
//     } catch (error) {
//         console.error("❌ MongoDB Connection Failed");
//         console.error(error);

//         process.exit(1);
//     }
// };

import dns from "node:dns";
import mongoose from "mongoose";
import { env } from "./env.js";

// Force Node to use Google's DNS servers
dns.setServers([
    "8.8.8.8",
    "8.8.4.4",
]);

export const connectDB = async () => {
    try {
        console.log("DNS Servers:", dns.getServers());

        await mongoose.connect(env.MONGO_URI);

        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed");
        console.error(error);

        process.exit(1);
    }
};