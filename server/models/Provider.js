const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  CCCD: { type: String, required: true },
  NgayCapCCCD: { type: Date, required: true },
  NoiCapCCCD: { type: String, required: true },
  STK: { type: String, required: true },
  TenNganHang: { type: String, required: true },
  AnhCCCD: { type: String, required: true },
});

module.exports = mongoose.model("Provider", providerSchema);
