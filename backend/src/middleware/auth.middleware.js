import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { verifyAccessToken } from "../lib/jwt.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyAccessToken(token);

    const user = await userRepository.findById(decoded.userId);

    if (!user) {
        throw new ApiError(401, "User not found");
    }

    req.user = {
        id: user._id,
        email: user.email,
        name: user.name,
    };

    next();
});