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
  }

  // Kiểm tra password tồn tại
  if (!formData.password) {
    return res.status(400).json({ message: "Thiếu mật khẩu trong formData" });
  }

  // Kiểm tra định dạng điện thoại nếu có
  if (formData.dienThoai && !/^[0-9]{10}$/.test(formData.dienThoai)) {
    return res
      .status(400)
      .json({ message: "Số điện thoại không hợp lệ (10 chữ số)" });
  }

  try {
    // Kiểm tra tồn tại email trước khi tiếp tục
    const existingByEmail = await User.findOne({ email: formData.email });
    if (existingByEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
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

    // Hash mật khẩu (chắc chắn dùng đúng key password)
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Parse ngaySinh nếu cần (kiểm tra hợp lệ)
    let ngaySinh = null;
    if (formData.ngaySinh) {
      const d = new Date(formData.ngaySinh);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: "Ngày sinh không hợp lệ" });
      }
      ngaySinh = d;
    }

    const user = new User({
      hoTen: formData.hoTen,
      ngaySinh,
      gioiTinh: formData.gioiTinh,
      diaChi: formData.diaChi,
      dienThoai: formData.dienThoai,
      email: formData.email,
      tenDangNhap: formData.tenDangNhap,
      password: hashedPassword,
    });

    await user.save();

    // Xóa record xác minh
    await Verification.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "Tài khoản đã được tạo thành công" });
  } catch (error) {
    console.error("❌ verifyOTP ERROR:", error);

    // Xử lý lỗi duplicate key của MongoDB (E11000)
    if (error.code === 11000) {
      const dupKey = Object.keys(error.keyValue || {}).join(", ");
      return res.status(400).json({
        message: `Trùng dữ liệu: ${dupKey} đã tồn tại`,
        detail: error.keyValue,
      });
    }

    // Lỗi validation Mongoose
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
