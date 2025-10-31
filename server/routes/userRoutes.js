// server/routes/userRoutes.js
import express from "express";
import { getUsers, loginUser } from "../controllers/userController.js";
import { checkEmailDomain, sendVerificationCode } from "../middlewares/verifyEmail.js";
import { forgotPassword } from "../controllers/forgotPasswordController.js";
import { verifyUser } from "../controllers/verifyController.js";

const router = express.Router();

// 🧩 Các route người dùng
router.post("/register", checkEmailDomain, sendVerificationCode);
router.post("/checkEmail", checkEmailDomain, sendVerificationCode);
router.post("/verifyUser", verifyUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.get("/", getUsers);

export default router;
