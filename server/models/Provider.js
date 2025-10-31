import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  // mongoose.Schema.Types.ObjectId là kiểu dữ liệu đặc biệt dùng để lưu ID của document khác trong MongoDB
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cccd: { type: String },
  ngayCapCCCD: { type: Date },
  noiCapCCCD: { type: String },
  soTaiKhoanNganHang: { type: String },
  tenNganHang: { type: String },
  cccdTruoc: { type: String },
  cccdSau: { type: String },
});

export default mongoose.model("Provider", providerSchema);
