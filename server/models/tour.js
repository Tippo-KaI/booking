// models/Tour.js (Đã sửa lại để dùng CommonJS)

const mongoose = require("mongoose"); // Dùng require

const tourSchema = new mongoose.Schema({
  // 1. Dữ liệu chính
  tenTour: { type: String, required: true },
  diaDiem: { type: String, required: true },
  moTa: { type: String, required: true }, // 2. Dữ liệu BÁN HÀNG TRỰC TIẾP (Thay thế linkAffiliate)

  giaCoBan: {
    type: Number,
    required: true,
    min: 0,
  }, // 👈 GIÁ CỐ ĐỊNH (Giá/người)
  thoiGian: {
    type: String,
    required: true,
  }, // 👈 THỜI GIAN CỐ ĐỊNH (Ví dụ: "3 ngày 2 đêm") // 3. Dữ liệu Hiển thị/Lọc

  anhDaiDien: { type: String, required: true }, // Các trường hỗ trợ lọc cơ bản

  loaiHinh: {
    type: String,
    enum: ["Biển", "Núi", "Văn hóa", "Nghỉ dưỡng", "Phiêu lưu"],
    required: true,
  },
  // Bỏ trường nganSach và thay bằng giá trị giaCoBan (Number)

  ngayTao: { type: Date, default: Date.now },
});

// Sử dụng module.exports để export Model
module.exports = mongoose.model("Tour", tourSchema);
