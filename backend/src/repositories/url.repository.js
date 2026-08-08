import Url, { URL_STATUS } from "../models/Url.js";

class UrlRepository {

    async create(data) {
        return Url.create(data);
    }

    async findById(id, projection = null) {
        return Url.findById(id, projection).lean();
    }

    async findByShortCode(shortCode, projection = null) {
        return Url.findOne({ shortCode }, projection).lean();
    }

    async existsByShortCode(shortCode) {
        const exists = await Url.exists({ shortCode });
        return !!exists;
    }

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

    async countByOwner(ownerId) {
        return Url.countDocuments({
            owner: ownerId,
        });
    }

    async findLatest() {
        return Url.findOne(
            {},
            { shortCode: 1 }
        )
            .sort({ createdAt: -1 })
            .lean();
    }

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