const express = require("express");
const router = express.Router(); //express.Router() tạo ra router riêng để định nghĩa các route
const {
  registerUser,
  getUsers,
  loginUser,
} = require("../controllers/userController");

const {
  checkEmailDomain,
  sendVerificationCode,
} = require("../middlewares/verifyEmail");

router.post("/register", checkEmailDomain, sendVerificationCode, registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);

module.exports = router;
