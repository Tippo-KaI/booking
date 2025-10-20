const User = require("../models/user");
const Verification = require("../models/verification");
const bcrypt = require("bcryptjs");

exports.forgotPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const existingByEmail = await User.findOne({ email });
    if (!existingByEmail) {
      return res.status(404).json({ message: "Tài khoản không tồn tại" });
    }

    const record = await Verification.findOne({ email });
    if (!record) {
      return res
        .status(400)
        .json({ message: "Không tìm thấy mã xác minh cho email này" });
    }
    if (record.code !== otp) {
      return res.status(400).json({ message: "Mã xác minh không đúng" });
    }
    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "Mã xác minh đã hết hạn" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    await Verification.deleteOne({ email });
    return res.status(200).json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};
