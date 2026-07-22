import urlService from "../services/url.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class UrlController {
    create = asyncHandler(async (req, res) => {
        const url = await urlService.create({
            owner: req.user.id,
            ...req.body,
        });

        return ApiResponse.created(
            res,
            url,
            "Short URL created successfully."
        );
    });

    resolve = asyncHandler(async (req, res) => {
        const url = await urlService.resolve(
            req.params.shortCode,
            {
                ip: req.ip,
                userAgent: req.get("User-Agent"),
                referrer: req.get("Referer") || null,
            }
        );

        return res.redirect(302, url.longUrl);
    });

    getByShortCode = asyncHandler(async (req, res) => {
        const url = await urlService.getByShortCode(
            req.params.shortCode,
            req.user.id
        );

        return ApiResponse.success(res, url);
    });

    getUserUrls = asyncHandler(async (req, res) => {
        const { page, limit } = req.query;

        const urls = await urlService.getUserUrls(
            req.user.id,
            page,
            limit
        );

        return ApiResponse.success(res, urls);
    });

    update = asyncHandler(async (req, res) => {
        const url = await urlService.update(
            req.params.shortCode,
            req.user.id,
            req.body
        );

        return ApiResponse.success(
            res,
            url,
            "URL updated successfully."
        );
    });

    delete = asyncHandler(async (req, res) => {
        await urlService.delete(
            req.params.shortCode,
            req.user.id
        );

        return ApiResponse.success(
            res,
            null,
            "URL deleted successfully."
        );
    });
}

export default new UrlController();