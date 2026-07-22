import { Router } from "express";

import urlController from "../controllers/url.controller.js";
import validateParams from "../middleware/validateParams.middleware.js";
import { resolveUrlSchema } from "../validators/url.validator.js";
import { redirectLimiter } from "../middleware/rateLimiter.middleware.js";
const router = Router();

router.get(
    "/:shortCode",
    redirectLimiter,
    validateParams(resolveUrlSchema),
    urlController.resolve
);

export default router;