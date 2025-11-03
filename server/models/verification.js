// Lưu mã OTP tạm thời cho mỗi email
import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("Verification", verificationSchema);
