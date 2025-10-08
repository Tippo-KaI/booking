const mongoose = require("mongoose"); // require - nạp thư viện mongoose

const userSchema = new mongoose.Schema({
  Avatar: { type: String },
  HoTen: { type: String, required: true },
  NgaySinh: { type: Date, required: true },
  GioiTinh: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  DiaChi: { type: String }, // địa chỉ
  DienThoai: { type: String, match: /^[0-9]{10}$/ },
  Email: {
    type: String,
    required: true,
    unique: true,
    match: /^\S+@\S+\.\S+$/,
  },
  TenDangNhap: { type: String, required: true, unique: true },
  MatKhau: { type: String, required: true },
  NgayDangKy: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
// Tạo model tên là user dựa trên userSchema rồi exports
