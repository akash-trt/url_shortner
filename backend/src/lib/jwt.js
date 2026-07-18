import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            email: user.email,
        },
        env.JWT_ACCESS_SECRET,
        {
            expiresIn: env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
        },
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
    return jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
    );
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
    return jwt.verify(
        token,
        env.JWT_REFRESH_SECRET
    );
};