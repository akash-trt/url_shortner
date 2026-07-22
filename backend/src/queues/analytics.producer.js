import { analyticsQueue } from "./analytics.queue.js";

class AnalyticsProducer {
    async trackClick(data) {
        await analyticsQueue.add(
            "track-click",
            data
        );
    }
}

export default new AnalyticsProducer();