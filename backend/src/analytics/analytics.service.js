import analyticsRepository from "./analytics.repository.js";
import urlRepository from "../repositories/url.repository.js";
import ApiError from "../utils/ApiError.js";
import axios from "axios";
import {UAParser} from "ua-parser-js";

class AnalyticsService {

    async track(data) {

        const { url, ip, userAgent, referrer, clickedAt } = data;

        let country = null;
        let city = null;

        const lookupIp = ["::1", "127.0.0.1"].includes(ip)
            ? "8.8.8.8"
            : ip;

        try {

            const { data: geo } = await axios.get(
                `http://ip-api.com/json/${lookupIp}`
            );

            if (geo.status === "success") {
                country = geo.country;
                city = geo.city;
            }

        } catch (err) {

            console.error("Geo lookup failed:", err.message);

        }

        return analyticsRepository.create({

            url,
            ip,
            userAgent,
            referrer,
            country,
            city,
            clickedAt,

        });

    }

    
    async #getOwnedUrl(shortCode, userId) {

        const url = await urlRepository.findByShortCode(
            shortCode,
            "_id owner"
        );
        if (!url) {
            throw new ApiError(404, "URL not found");
        }

        if (url.owner.toString() !== userId.toString()) {
            throw new ApiError(
                403,
                "You are not authorized to view analytics for this URL"
            );
        }

        return url;
    }

    async getTotalClicks(shortCode, userId) {

        const url = await this.#getOwnedUrl(
            shortCode,
            userId
        );

        return analyticsRepository.countByUrl(
            url._id
        );
    }

    async getRecentClicks(shortCode, userId, limit = 20) {

        const url = await this.#getOwnedUrl(
            shortCode,
            userId
        );

        return analyticsRepository.findByUrl(
            url._id,
            limit
        );
    }

    async getSummary(shortCode, userId) {

        const url = await this.#getOwnedUrl(
            shortCode,
            userId
        );

        return analyticsRepository.getSummary(
            url._id
        );
    }

}

export default new AnalyticsService();