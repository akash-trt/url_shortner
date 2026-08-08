import { URL_STATUS } from "../models/Url.js";
import {env} from "../config/env.js";

export function isExpired(url) {
    if (!url.expiresAt) {
        return false;
    }

    return new Date(url.expiresAt) <= new Date();
}

export function isAccessible(url) {
    return (
        url.status === URL_STATUS.ACTIVE &&
        !isExpired(url)
    );
}

/**
 * Builds the public short URL.
 *
 * @param {string} shortCode
 * @returns {string}
 */
export function buildShortUrl(shortCode) {
    return `${env.BASE_URL}/${shortCode}`;
}

/**
 * Convert Mongo document into API response.
 *
 * @param {Object} url
 * @returns {Object}
 */
export function toUrlResponse(url) {
    return {
        id: url._id,
        shortCode: url.shortCode,
        shortUrl: buildShortUrl(url.shortCode),
        longUrl: url.longUrl,
        status: url.status,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
    };
}
