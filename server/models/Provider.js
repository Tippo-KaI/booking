const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  //mongoose.Schema.Types.ObjectId là một kiểu dữ liệu đặc biệt dùng để lưu ID của tài liệu (document) khác trong MongoDB
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cccd: { type: String },
  ngayCapCCCD: { type: Date },
  noiCapCCCD: { type: String },
  soTaiKhoanNganHang: { type: String },
  tenNganHang: { type: String },
  cccdTruoc: { type: String },
  cccdSau: { type: String },
});

module.exports = mongoose.model("Provider", providerSchema);
