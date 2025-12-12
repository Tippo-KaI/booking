// models/TourBooking.js

const mongoose = require("mongoose");

const tourBookingSchema = new mongoose.Schema({
  // Thông tin Tour được đặt
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  tenTour: { type: String, required: true },

  // Thông tin Khách hàng (Liên kết với User và thông tin liên hệ)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hoTenKhach: { type: String, required: true },
  emailKhach: { type: String, required: true },
  dienThoaiKhach: { type: String },

  // Thông tin Đặt chỗ & Chi phí
  ngayKhoiHanh: { type: Date, required: true },
  soLuongNguoi: { type: Number, required: true, min: 1 },

  giaCoBan: { type: Number, required: true }, // Giá/người tại thời điểm đặt
  tongChiPhi: { type: Number, required: true }, // Tổng Chi phí = giaCoBan * soLuongNguoi
  thoiGianTour: { type: String },

  ghiChu: { type: String },

  // Quản lý Trạng thái Booking (Admin)
  trangThai: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },
  ngayTao: { type: Date, default: Date.now },
  ngayCapNhat: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TourBooking", tourBookingSchema);
