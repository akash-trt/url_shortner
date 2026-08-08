import express from "express";
import {register,login,getCurrentUser,logout,refreshAccessToken} from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import {protect} from "../middleware/auth.middleware.js";
import {registerSchema,loginSchema,} from "../validators/auth.validator.js";
import {loginLimiter,registerLimiter} from "../middleware/rateLimiter.middleware.js";
const router = express.Router();

router.post("/register",registerLimiter,validate(registerSchema),register);
router.post("/login",loginLimiter,validate(loginSchema),login);
router.get("/me",protect,getCurrentUser);
router.post("/logout",protect,logout);
router.post("/refresh",refreshAccessToken);

export default router;