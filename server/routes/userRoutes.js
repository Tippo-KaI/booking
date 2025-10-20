const express = require("express");
const router = express.Router(); //express.Router() tạo ra router riêng để định nghĩa các route
const { getUsers, loginUser } = require("../controllers/userController");

const {
  checkEmailDomain,
  sendVerificationCode,
} = require("../middlewares/verifyEmail");

const { forgotPassword } = require("../controllers/forgotPasswordController");

const { verifyUser } = require("../controllers/verifyController");

router.post("/register", checkEmailDomain, sendVerificationCode);
router.post("/checkEmail", checkEmailDomain, sendVerificationCode);
router.post("/verifyUser", verifyUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.get("/", getUsers);

module.exports = router;
