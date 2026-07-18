import User from "../models/User.js";

class UserRepository {

    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findById(id) {
        return await User.findById(id);
    }

    async findByRefreshToken(refreshToken) {
        return User.findOne({ refreshToken });
    }

    async updateRefreshToken(userId, refreshToken) {
        return User.findByIdAndUpdate(
            userId,
            {
                refreshToken,
            },
            {
                new: true,
            }
        );
    }
    async removeRefreshToken(userId) {
        return await User.findByIdAndUpdate(
            userId,
            {
                refreshToken: null,
            }
        );
    }
}

export default new UserRepository();