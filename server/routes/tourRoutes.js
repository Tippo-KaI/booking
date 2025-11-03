// routes/tourRoutes.js
import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createTour,
  getTours,
  deleteTour,
  registerCustomer,
} from "../controllers/tourController.js"; 

const router = express.Router();

// 🧱 Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Đã tạo thư mục uploads ở:", uploadDir);
}

// 🧩 Cấu hình multer để lưu file ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// 🟢 Tạo tour mới
router.post("/", upload.single("hinhAnh"), createTour);

// 🟢 Lấy danh sách tour (chỉ tour còn chỗ)
router.get("/", getTours);

// 🟡 Cập nhật số lượng khách đăng ký
router.put("/:id/register", registerCustomer);

// 🔴 Xóa tour
router.delete("/:id", deleteTour);

export default router;
