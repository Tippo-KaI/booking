// models/Invoice.js

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  // 1. Liên kết với Booking
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourBooking",
    required: true,
    unique: true, // Mỗi Booking chỉ có 1 Hóa đơn
  },

  // 2. Thông tin chung
  maHoaDon: { type: String, required: true, unique: true }, // VD: INV-20250001
  ngayXuat: { type: Date, default: Date.now },

  // 3. Thông tin tài chính (Sao chép từ Booking)
  tongChiPhi: { type: Number, required: true },
  thueVAT: { type: Number, default: 0 }, // Giả sử 0% hoặc 10%
  tongThanhToan: { type: Number, required: true }, // tongChiPhi + Thue - GiamGia

  // 4. Trạng thái Thanh toán
  trangThaiThanhToan: {
    type: String,
    enum: ["Unpaid", "Paid", "Refunded"],
    default: "Unpaid",
  },
  phuongThucThanhToan: {
    type: String,
    enum: ["Transfer", "Cash", "Card"],
    default: "Unpaid",
  },

  // 5. Thông tin Khách hàng
  hoTenKhachHang: { type: String }, // Sao chép từ Booking
  emailKhachHang: { type: String },

  // 6. Quản lý
  ngayCapNhat: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
