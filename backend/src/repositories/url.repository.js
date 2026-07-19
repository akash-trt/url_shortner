import Url, { URL_STATUS } from "../models/Url.js";

class UrlRepository {
    /**
     * Create a new URL document.
     * @param {Object} data
     * @returns {Promise<Object>}
     */
    async create(data) {
        return Url.create(data);
    }

    /**
     * Find URL by Mongo ID.
     * @param {string} id
     * @param {string|Object|null} projection
     * @returns {Promise<Object|null>}
     */
    async findById(id, projection = null) {
        return Url.findById(id, projection).lean();
    }

    /**
     * Find URL by short code.
     * @param {string} shortCode
     * @param {string|Object|null} projection
     * @returns {Promise<Object|null>}
     */
    async findByShortCode(shortCode, projection = null) {
        return Url.findOne({ shortCode }, projection).lean();
    }

    /**
     * Check whether a short code already exists.
     * @param {string} shortCode
     * @returns {Promise<boolean>}
     */
    async existsByShortCode(shortCode) {
        const exists = await Url.exists({ shortCode });
        return !!exists;
    }

    /**
     * Get paginated URLs for a user.
     * @param {string} ownerId
     * @param {Object} options
     * @returns {Promise<Array>}
     */
    async findByOwner(ownerId, options = {}) {
        const {
            page = 1,
            limit = 20,
            projection = null,
        } = options;

        return Url.find(
            { owner: ownerId },
            projection
        )
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
    }

    /**
     * Count URLs owned by a user.
     * @param {string} ownerId
     * @returns {Promise<number>}
     */
    async countByOwner(ownerId) {
        return Url.countDocuments({
            owner: ownerId,
        });
    }

    /**
     * Get the latest created URL.
     * Used only for Redis counter recovery.
     * @returns {Promise<Object|null>}
     */
    async findLatest() {
        return Url.findOne(
            {},
            { shortCode: 1 }
        )
            .sort({ createdAt: -1 })
            .lean();
    }

    /**
     * Update URL fields.
     * @param {string} id
     * @param {Object} updates
     * @returns {Promise<Object|null>}
     */
    async update(id, updates) {
        return Url.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).lean();
    }

    /**
     * Soft delete (disable) URL.
     * @param {string} id
     * @returns {Promise<Object|null>}
     */
    async softDelete(id) {
        return Url.findByIdAndUpdate(
            id,
            {
                status: URL_STATUS.DISABLED,
            },
            {
                new: true,
            }
        ).lean();
    }

    async findByIdAndOwner(id, ownerId, projection = null) {
        return Url.findOne(
            {
                _id: id,
                owner: ownerId,
            },
            projection
        ).lean();
    }

    async updateByOwner(id, ownerId, updates) {
        return Url.findOneAndUpdate(
            {
                _id: id,
                owner: ownerId,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        ).lean();
    }

    async softDeleteByOwner(id, ownerId) {
        return Url.findOneAndUpdate(
            {
                _id: id,
                owner: ownerId,
            },
            {
                status: URL_STATUS.DISABLED,
            },
            {
                new: true,
            }
        ).lean();
    }
}

export default new UrlRepository();