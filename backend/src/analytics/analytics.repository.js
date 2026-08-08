import Analytics from "./analytics.model.js";
import mongoose from "mongoose";

class AnalyticsRepository {

    async create(data) {
        return Analytics.create(data);
    }

    async countByUrl(urlId) {
        return Analytics.countDocuments({
            url: urlId,
        });
    }

    async findByUrl(urlId, limit = 20) {
        return Analytics.find({
            url: urlId,
        })
            .sort({
                clickedAt: -1,
            })
            .limit(limit)
            .lean();
    }

    async getSummary(urlId) {

        const objectId = new mongoose.Types.ObjectId(urlId);

        const [summary] = await Analytics.aggregate([
            {
                $match: {
                    url: objectId,
                },
            },
            {
                $group: {
                    _id: "$url",

                    totalClicks: {
                        $sum: 1,
                    },

                    uniqueVisitors: {
                        $addToSet: "$ip",
                    },

                    lastClickedAt: {
                        $max: "$clickedAt",
                    },
                },
            },
            {
                $project: {
                    _id: 0,

                    totalClicks: 1,

                    uniqueVisitors: {
                        $size: "$uniqueVisitors",
                    },

                    lastClickedAt: 1,
                },
            },
        ]);

        return (
            summary || {
                totalClicks: 0,
                uniqueVisitors: 0,
                lastClickedAt: null,
            }
        );
    }
}

export default new AnalyticsRepository();