const bcrypt = require("bcryptjs");
const User = require("../models/user");
const verification = require("../models/verification");

exports.verifyOTP = async (req, res) => {
  const { email, otp, formData } = req.body;

  if (!email || !otp)
    return res.status(400).json({ message: "Thiếu email hoặc mã OTP" });

  const existingUser = await User.findOne({
    $or: [{ email: formData.email }, { tenDangNhap: formData.tenDangNhap }],
  });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email hoặc tên đăng nhập đã tồn tại" });
  }

  try {
    const record = await verification.findOne({ email });

    if (!record)
      return res
        .status(400)
        .json({ message: "Không tìm thấy mã xác minh cho email này" });

    if (record.code !== otp)
      return res.status(400).json({ message: "Mã xác minh không đúng" });

    if (record.expiresAt < new Date())
      return res.status(400).json({ message: "Mã xác minh đã hết hạn" });

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(formData.matKhau, 10);

    // Chuyển đổi ngày
    const ngaySinh = new Date(formData.ngaySinh);

    // Lưu user
    const user = new User({
      hoTen: formData.hoTen,
      ngaySinh,
      gioiTinh: formData.gioiTinh,
      diaChi: formData.diaChi,
      dienThoai: formData.dienThoai,
      email: formData.email,
      tenDangNhap: formData.tenDangNhap,
      matKhau: hashedPassword,
    });

    await user.save();
    await verification.deleteOne({ email });

    return res
      .status(200)
      .json({ message: "Tài khoản đã được tạo thành công" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server khi xác minh mã" });
  }
};
