import { Router } from "express";

import urlController from "../controllers/url.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import validateParams from "../middleware/validateParams.middleware.js";
import validateQuery from "../middleware/validateQuery.middleware.js";
import analyticsController from "../controllers/analytics.controller.js";
import { createUrlLimiter } from "../middleware/rateLimiter.middleware.js"; 

import {
    createUrlSchema,
    updateUrlSchema,
    getUrlSchema,
    listUrlsSchema,
    deleteUrlSchema,
} from "../validators/url.validator.js";

const router = Router();

router.use(protect);

router.post("/",createUrlLimiter, validate(createUrlSchema), urlController.create);
router.get("/", validateQuery(listUrlsSchema), urlController.getUserUrls);
router.get("/:shortCode", validateParams(getUrlSchema), urlController.getByShortCode);
router.patch("/:shortCode", validate(updateUrlSchema), urlController.update);
router.delete("/:shortCode", validateParams(deleteUrlSchema), urlController.delete);

router.get("/:shortCode/clicks/count", analyticsController.totalClicks);
router.get("/:shortCode/clicks", analyticsController.recentClicks);
router.get("/:shortCode/analytics", analyticsController.summary);
export default router;