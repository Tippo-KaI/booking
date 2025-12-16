// models/Hotel.js

const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  tenKhachSan: { type: String, required: true },
  moTa: { type: String, required: true },
  tinhThanh: { type: String, required: true }, 
  diaChiChiTiet: { type: String, required: true }, 
  hangSao: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  loaiHinh: {
    type: String,
    enum: ["Khách sạn", "Resort", "Homestay", "Villa", "Khác"],
    default: "Khách sạn",
    required: true,
  },
  giaThapNhat: {
    type: Number,
    min: 0,
    required: true,
  },
  linkDatPhong: { type: String, required: true }, 
  anhDaiDien: { type: String, required: true }, 
  ngayTao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Hotel", hotelSchema);
