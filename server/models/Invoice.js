// models/Invoice.js

const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TourBooking",
    required: true,
    unique: true, 
  },
  maHoaDon: { type: String, required: true, unique: true }, 
  ngayXuat: { type: Date, default: Date.now },
  tongChiPhi: { type: Number, required: true },
  thueVAT: { type: Number, default: 0 }, 
  tongThanhToan: { type: Number, required: true },
  trangThaiThanhToan: {
    type: String,
    enum: ["Unpaid", "Paid", "Refunded"],
    default: "Unpaid",
  },
  phuongThucThanhToan: {
    type: String,
    enum: ["Transfer", "Cash", "Card"],
    default: "Unpaid",
  },
  hoTenKhachHang: { type: String }, 
  emailKhachHang: { type: String },
  ngayCapNhat: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
