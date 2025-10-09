const express = require("express");
const router = express.Router(); //express.Router() tạo ra router riêng để định nghĩa các route
const { getUsers, loginUser } = require("../controllers/userController");

const {
  checkEmailDomain,
  sendVerificationCode,
} = require("../middlewares/verifyEmail");

const { verifyOTP } = require("../controllers/verifyController");

router.post("/register", checkEmailDomain, sendVerificationCode);
router.post("/verifyOTP", verifyOTP);
router.post("/login", loginUser);
router.get("/", getUsers);

module.exports = router;
