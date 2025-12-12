// models/Event.js

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  // 1. Thông tin cơ bản về sự kiện
  tenSuKien: { type: String, required: true }, // Tên sự kiện
  moTa: { type: String, required: true }, // Mô tả

  // 2. Thời gian và Địa điểm
  ngayBatDau: { type: Date, required: true },
  ngayKetThuc: { type: Date, required: true },

  // Địa điểm chính (Ví dụ: "Hà Nội", "Đà Nẵng" - Dùng để lọc)
  tinhThanh: { type: String, required: true },

  // Địa điểm cụ thể (Ví dụ: "Công viên Thống Nhất", "Bà Nà Hills")
  diaDiemCuThe: { type: String, required: true },

  // 3. Thông tin khác
  anhDaiDien: { type: String, required: false }, // URL Ảnh (optional)
  ngayTao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
