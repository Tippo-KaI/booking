// models/TourBooking.js

const mongoose = require("mongoose");

const tourBookingSchema = new mongoose.Schema({
  tourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tour",
    required: true,
  },
  tenTour: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  hoTenKhach: { type: String, required: true },
  emailKhach: { type: String, required: true },
  dienThoaiKhach: { type: String },
  ngayKhoiHanh: { type: Date, required: true },
  soLuongNguoi: { type: Number, required: true, min: 1 },
  giaCoBan: { type: Number, required: true }, 
  tongChiPhi: { type: Number, required: true }, 
  thoiGianTour: { type: String },
  ghiChu: { type: String },
  trangThai: {
    type: String,
    enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
    default: "Pending",
  },
  ngayTao: { type: Date, default: Date.now },
  ngayCapNhat: { type: Date, default: Date.now },
});

module.exports = mongoose.model("TourBooking", tourBookingSchema);
