import authService from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { refreshCookieOptions } from "../config/cookie.js";
export const register = asyncHandler(
    async (req, res) => {

        const result = await authService.register(req.body);
        res.cookie(
            "refreshToken",
            result.refreshToken,
            refreshCookieOptions
        );

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    user: result.user,
                    accessToken: result.accessToken,
                },
                "User registered successfully"
            )
        );

    }
);

export const login = asyncHandler(
    async (req, res) => {

        const result = await authService.login(req.body);

        res.cookie(
            "refreshToken",
            result.refreshToken,
            refreshCookieOptions
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    user: result.user,
                    accessToken: result.accessToken,
                },
                "Login successful"
            )
        );

    }
);

export const getCurrentUser = asyncHandler(async (req, res) => {

    res.status(200).json(
        new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        )
    );

});

export const logout =
asyncHandler(async (req, res) => {

    await authService.logout(req.user.id);

    res.clearCookie(
        "refreshToken",
        refreshCookieOptions
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Logged out successfully"
        )
    );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {

        const refreshToken = req.cookies.refreshToken;

        const tokens = await authService.refresh(refreshToken);

        res.cookie(
            "refreshToken",
            tokens.refreshToken,
            refreshCookieOptions
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    accessToken:tokens.accessToken,
                },
                "Token refreshed successfully"
            )
        );
    });