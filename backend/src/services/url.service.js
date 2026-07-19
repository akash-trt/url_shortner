import urlRepository from "../repositories/url.repository.js";
import redisCounterService from "./redis-counter.service.js";
import cacheService from "./cache.service.js";

import { URL_STATUS } from "../models/Url.js";
import  ApiError  from "../utils/ApiError.js";
import {isExpired,toUrlResponse,} from "../utils/url.util.js";

class UrlService {
    async create({owner,longUrl,customAlias,expiresAt, }) {
        let shortCode;
        let isCustomAlias = false;

        if (customAlias) {
            const exists = await urlRepository.existsByShortCode(customAlias);

            if (exists) {
                throw new ApiError(
                    409,
                    "Custom alias already exists."
                );
            }

            shortCode = customAlias;
            isCustomAlias = true;
        } else {
            shortCode = await redisCounterService.generateShortCode();
        }

        const url = await urlRepository.create({
            owner,
            shortCode,
            longUrl,
            customAlias: isCustomAlias,
            status: URL_STATUS.ACTIVE,
            expiresAt,
        });

        await this.#warmCache(url);

        return toUrlResponse(url);
    }

    async resolve(shortCode) {
        let url = await cacheService.getUrl(shortCode);

        if (!url) {
            url = await urlRepository.findByShortCode(
                shortCode,
                "shortCode longUrl status expiresAt createdAt updatedAt"
            );

            if (!url) {
                throw new ApiError(404, "Short URL not found.");
            }

            await this.#warmCache(url);
        }

        this.#validateAccessibility(url);

        return url;
    }

    async getById(id, ownerId) {
        const url = await urlRepository.findByIdAndOwner(
            id,
            ownerId
        );

        if (!url) {
            throw new ApiError(404, "URL not found.");
        }

        return toUrlResponse(url);
    }

    async getUserUrls(ownerId, page = 1, limit = 20) {
        const [urls, total] = await Promise.all([
            urlRepository.findByOwner(ownerId, {
                page,
                limit,
            }),
            urlRepository.countByOwner(ownerId),
        ]);

        return {
            total,
            page,
            limit,
            data: urls.map(toUrlResponse),
        };
    }

    async update(id, ownerId, updates) {
        const url =
            await urlRepository.updateByOwner(
                id,
                ownerId,
                updates
            );

        if (!url) {
            throw new ApiError(404, "URL not found.");
        }

        await this.#warmCache(url);

        return toUrlResponse(url);
    }

    async delete(id, ownerId) {
        const url =
            await urlRepository.softDeleteByOwner(
                id,
                ownerId
            );

        if (!url) {
            throw new ApiError(404, "URL not found.");
        }

        await cacheService.deleteUrl(url.shortCode);
    }

    async #warmCache(url) {
        try {
            await cacheService.setUrl(url.shortCode, {
                longUrl: url.longUrl,
                status: url.status,
                expiresAt: url.expiresAt,
            });
        } catch (_) {}
    }

    #validateAccessibility(url) {
        if (url.status === URL_STATUS.BLOCKED) {
            throw new ApiError(403, "URL has been blocked.");
        }

        if (url.status === URL_STATUS.DISABLED) {
            throw new ApiError(410, "URL has been disabled.");
        }

        if (isExpired(url)) {
            throw new ApiError(410, "URL has expired.");
        }
    }
}

export default new UrlService();