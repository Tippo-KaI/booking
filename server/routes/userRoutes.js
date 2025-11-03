const express = require("express");
const auth = require("../middlewares/auth");
const path = require("path");
const multer = require("multer");
const router = express.Router(); //express.Router() tạo ra router riêng để định nghĩa các route
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

router.post("/register", checkEmailDomain, sendVerificationCode);
router.post("/checkEmail", checkEmailDomain, sendVerificationCode);
router.post("/verifyUser", verifyUser);
router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.get("/info", getUserInfo);
router.get("/", getUsers);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // <<< Sửa lỗi thiếu 'path'
    const uniqueSuffix = Date.now() + path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Không phải là ảnh! Vui lòng chỉ upload ảnh"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.put(
  "/update",
  auth,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cccdTruoc", maxCount: 1 },
    { name: "cccdSau", maxCount: 1 },
  ]),
  updateUser
);

module.exports = router;
