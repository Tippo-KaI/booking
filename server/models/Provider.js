const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  //mongoose.Schema.Types.ObjectId là một kiểu dữ liệu đặc biệt dùng để lưu ID của tài liệu (document) khác trong MongoDB
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cccd: { type: String, required: true },
  ngayCapCCCD: { type: Date, required: true },
  noiCapCCCD: { type: String, required: true },
  soTaiKhoanNganHang: { type: String, required: true },
  tenNganHang: { type: String, required: true },
  cccdTruoc: { type: String, required: true },
  cccdSau: { type: String, required: true },
});

module.exports = mongoose.model("Provider", providerSchema);
