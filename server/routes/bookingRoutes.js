// routes/bookingRoutes.js

const express = require("express");
const {
  createTourBooking,
  getAllTourBookings,
  readOneBooking,
  readMyBookings, // 👈 Import hàm mới
  updateBookingStatus,
} = require("../controllers/bookingController");
const auth = require("../middlewares/auth"); // Middleware Xác thực

const router = express.Router();

// 1. ROUTE CHO USER
router.post("/tour", auth, createTourBooking); // Gửi yêu cầu đặt Tour
router.get("/my-tours", auth, readMyBookings); // Lấy danh sách đơn hàng của người dùng đang đăng nhập
router.get("/:id", auth, readOneBooking); // Lấy chi tiết một Booking (dùng cho Admin và User)

// 2. ROUTE CHO ADMIN (ĐƯỜNG DẪN KHÁC BIỆT DÙ CÙNG CONTROLLER)
router.get("/admin/tours", auth, getAllTourBookings);
router.put("/admin/tours/:id", auth, updateBookingStatus);

module.exports = router;
