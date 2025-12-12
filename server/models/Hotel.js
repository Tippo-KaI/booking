// models/Hotel.js

const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  // 1. Dữ liệu cơ bản
  tenKhachSan: { type: String, required: true },
  moTa: { type: String, required: true },

  // 2. Địa điểm
  tinhThanh: { type: String, required: true }, // Tỉnh/Thành phố
  diaChiChiTiet: { type: String, required: true }, // Địa chỉ cụ thể

  // 3. Thông tin hiển thị/Lọc
  hangSao: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  loaiHinh: {
    type: String,
    enum: ["Khách sạn", "Resort", "Homestay", "Villa", "Khác"], // Ví dụ phân loại
    default: "Khách sạn",
    required: true,
  },
  giaThapNhat: {
    type: Number,
    min: 0,
    required: true,
  },

  // 4. Liên kết Affiliate và Media
  linkDatPhong: { type: String, required: true }, // Link đặt phòng (Affiliate)
  anhDaiDien: { type: String, required: true }, // URL ảnh đại diện

  // 5. Metadata
  ngayTao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hotel", hotelSchema);
