import { Router } from "express";

import urlController from "../controllers/url.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import validateParams from "../middleware/validateParams.middleware.js";
import validateQuery from "../middleware/validateQuery.middleware.js";

import {
    createUrlSchema,
    updateUrlSchema,
    getUrlSchema,
    listUrlsSchema,
    deleteUrlSchema,
} from "../validators/url.validator.js";

const router = Router();

router.use(protect);

router.post(
    "/",
    validate(createUrlSchema),
    urlController.create
);

router.get(
    "/",
    validateQuery(listUrlsSchema),
    urlController.getUserUrls
);

router.get(
    "/:id",
    validateParams(getUrlSchema),
    urlController.getById
);

router.patch(
    "/:id",
    validate(updateUrlSchema),
    urlController.update
);

router.delete(
    "/:id",
    validateParams(deleteUrlSchema),
    urlController.delete
);

export default router;