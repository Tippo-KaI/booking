// Dùng 'require' (CommonJS) cho tất cả
const express = require("express");

const {
  getUsers,
  getUserInfo,
  loginUser,
  updateUser,
} = require("../controllers/userController");
const {
  checkEmailDomain,
  sendVerificationCode,
} = require("../middlewares/verifyEmail");
const { forgotPassword } = require("../controllers/forgotPasswordController");
const { verifyUser } = require("../controllers/verifyController");
const auth = require("../middlewares/auth");

const router = express.Router();

// 🧩 Các route người dùng
router.post("/register", checkEmailDomain, sendVerificationCode);
router.post("/checkEmail", checkEmailDomain, sendVerificationCode);
router.post("/verifyUser", verifyUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.get("/info", auth, getUserInfo);
router.get("/", getUsers);

// Dùng 'module.exports' thay vì 'export default'
module.exports = router;
