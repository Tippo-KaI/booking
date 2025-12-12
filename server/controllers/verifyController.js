import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Verification from "../models/verification.js";

export const verifyUser = async (req, res) => {
  const { email, otp, formData } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Thiếu email hoặc mã OTP" });
  }

  if (!formData || typeof formData !== "object") {
    return res.status(400).json({ message: "Thiếu formData" });
  } // Kiểm tra các trường BẮT BUỘC theo Model tối giản: hoTen, email, password

  if (!formData.hoTen || !formData.email || !formData.password) {
    return res.status(400).json({
      message: "Thiếu thông tin bắt buộc (Họ tên, Email, Mật khẩu).",
    });
  } // ⚠️ Đã loại bỏ kiểm tra tenDangNhap và các trường khác

  try {
    // Kiểm tra tồn tại email (chỉ cần kiểm tra email vì không dùng tên đăng nhập)
    const existingByEmail = await User.findOne({ email: formData.email });
    if (existingByEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    } // 1. Kiểm tra Mã OTP

    // ❌ Đã loại bỏ kiểm tra existingByUsername

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
    } // 2. Hash mật khẩu

    const hashedPassword = await bcrypt.hash(formData.password, 10); // 3. Tạo bản ghi User mới

    const user = new User({
      hoTen: formData.hoTen,
      email: formData.email, // ❌ Đã loại bỏ: tenDangNhap: formData.tenDangNhap,
      password: hashedPassword,
    });

    await user.save(); // 4. Xóa record xác minh và trả về thành công

    await Verification.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "Tài khoản đã được tạo thành công" });
  } catch (error) {
    console.error("❌ verifyOTP ERROR:", error); // Xử lý lỗi duplicate key của MongoDB (E11000)

    if (error.code === 11000) {
      const dupKey = Object.keys(error.keyValue || {}).join(", ");
      return res.status(400).json({
        message: `Trùng dữ liệu: ${dupKey} đã tồn tại`,
        detail: error.keyValue,
      });
    } // Xử lý Lỗi validation Mongoose

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res
        .status(400)
        .json({ message: "Validation error", errors: messages });
    }

    return res.status(500).json({
      message: "Lỗi server khi xác minh mã",
    });
  }
};
