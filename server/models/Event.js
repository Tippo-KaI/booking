// models/Event.js

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  tenSuKien: { type: String, required: true }, 
  moTa: { type: String, required: true },
  ngayBatDau: { type: Date, required: true },
  ngayKetThuc: { type: Date, required: true },
  tinhThanh: { type: String, required: true },
  diaDiemCuThe: { type: String, required: true },
  anhDaiDien: { type: String, required: false }, 
  ngayTao: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
