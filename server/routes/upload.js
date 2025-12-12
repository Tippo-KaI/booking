const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Cấu hình nơi lưu + tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Lưu trong folder uploads
  },
  filename: function (req, file, cb) {
    // Tên file: thời gian + tên gốc
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Chỉ cho upload file ảnh
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Chỉ cho phép upload file ảnh!"), false);
};

const upload = multer({ storage, fileFilter });

// API upload ảnh
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không có file được upload!" });
  }

  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

  return res.json({
    message: "Upload ảnh thành công!",
    url: imageUrl,
  });
});

module.exports = router;
