import express from "express";
import {register,login,getCurrentUser,logout,refreshAccessToken} from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import {protect} from "../middleware/auth.middleware.js";
import {registerSchema,loginSchema,} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register",validate(registerSchema),register);
router.post("/login",validate(loginSchema),login);
router.get("/me",protect,getCurrentUser);
router.post("/logout",protect,logout);
router.post("/refresh",refreshAccessToken);

export default router;