// models/Tour.js (Đã sửa lại để dùng CommonJS)

const mongoose = require("mongoose"); // Dùng require

const tourSchema = new mongoose.Schema({
  tenTour: { type: String, required: true },
  diaDiem: { type: String, required: true },
  moTa: { type: String, required: true }, 
  giaCoBan: {
    type: Number,
    required: true,
    min: 0,
  }, 
  thoiGian: {
    type: String,
    required: true,
  },
  anhDaiDien: { type: String, required: true }, 
  loaiHinh: {
    type: String,
    enum: ["Biển", "Núi", "Văn hóa", "Nghỉ dưỡng", "Phiêu lưu"],
    required: true,
  },
  ngayTao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Tour", tourSchema);
