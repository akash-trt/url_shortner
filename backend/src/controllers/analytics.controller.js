import analyticsService from "../analytics/analytics.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class AnalyticsController {

    totalClicks = asyncHandler(async (req, res) => {

        const totalClicks =
            await analyticsService.getTotalClicks(
                req.params.shortCode,
                req.user.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                { totalClicks },
                "Total clicks fetched successfully"
            )
        );
    });

    recentClicks = asyncHandler(async (req, res) => {

        const limit = Number(req.query.limit) || 20;

        const clicks =
            await analyticsService.getRecentClicks(
                req.params.shortCode,
                req.user.id,
                Number(req.query.limit) || 20
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                clicks,
                "Recent clicks fetched successfully"
            )
        );
    });

    summary = asyncHandler(async (req, res) => {

        const summary =
            await analyticsService.getSummary(
                req.params.shortCode,
                req.user.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                summary,
                "Analytics summary fetched successfully"
            )
        );
    });

}

export default new AnalyticsController();