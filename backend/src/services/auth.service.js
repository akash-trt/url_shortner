import userRepository from "../repositories/user.repository.js";
import { hashPassword,comparePassword,} from "../lib/hash.js";
import { generateAccessToken,generateRefreshToken,verifyAccessToken,verifyRefreshToken} from "../lib/jwt.js";
import { hashToken } from "../lib/token.js";
import ApiError from "../utils/ApiError.js";


class AuthService {

    async register(data) {

        const existingUser = await userRepository.findByEmail(data.email);

        if (existingUser) {
            throw new ApiError(
                409,
                "Email already registered"
            );
        }

        const hashedPassword = await hashPassword(data.password);

        const user =
            await userRepository.create({
                ...data,
                password: hashedPassword,
            });

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        await userRepository.updateRefreshToken(
            user._id,
            hashToken(refreshToken)
        );

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }

    async login(data) {

        const user =  await userRepository.findByEmail(data.email);

        if (!user) {
            throw new ApiError(
                401,
                "Invalid credentials"
            );
        }

        const matched =
            await comparePassword(
                data.password,
                user.password
            );

        if (!matched) {
            throw new ApiError(
                401,
                "Invalid credentials"
            );
        }

        const accessToken = generateAccessToken(user);

        const refreshToken = generateRefreshToken(user);

        await userRepository.updateRefreshToken(
            user._id,
            hashToken(refreshToken)
        );

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        };
    }

    async logout(userId){
        await userRepository.removeRefreshToken(userId);
    }

    async refresh(refreshToken) {

        if (!refreshToken) {
            throw new ApiError(
                401,
                "Refresh token missing"
            );
        }

        const decoded = verifyRefreshToken(refreshToken);

        const user =
            await userRepository.findById(
                decoded.userId
            );

        if (!user) {
            throw new ApiError(
                401,
                "User not found"
            );
        }

        if (user.refreshToken !== hashToken(refreshToken)) {
            throw new ApiError(
                401,
                "Invalid refresh token"
            );
        }

        const newAccessToken = generateAccessToken(user);

        const newRefreshToken = generateRefreshToken(user);

        await userRepository.updateRefreshToken(
            user._id,
            hashToken(newRefreshToken)
        );

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

}


export default new AuthService();