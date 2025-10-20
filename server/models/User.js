const mongoose = require("mongoose"); // require - nạp thư viện mongoose

const userSchema = new mongoose.Schema({
  avatar: { type: String },
  hoTen: { type: String, required: true },
  ngaySinh: { type: Date, required: true },
  gioiTinh: { type: String, enum: ["Nam", "Nữ", "Khác"] },
  diaChi: { type: String }, // địa chỉ
  dienThoai: { type: String, match: /^[0-9]{10}$/ },
  email: {
    type: String,
    required: true,
    unique: true, //db.users.createIndex({ email: 1 }, { unique: true })
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  tenDangNhap: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  ngayDangKy: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
// Tạo model tên là user dựa trên userSchema rồi exports
