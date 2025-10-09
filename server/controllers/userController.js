const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-matKhau"); // Ẩn mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  try {
    const { taiKhoan, matKhau } = req.body; // taiKhoan có thể là email hoặc tenDangNhap

    if (!taiKhoan || !matKhau) {
      return res
        .status(400)
        .json({ message: "Thiếu Email/Tên đăng nhập hoặc Mật khẩu" });
    }

    // Tìm theo email hoặc tên đăng nhập
    const user = await User.findOne({
      $or: [{ email: taiKhoan }, { tenDangNhap: taiKhoan }],
    });

    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(matKhau, user.matKhau);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Ẩn mật khẩu khi trả về
    const { matKhau: pw, ...userData } = user.toObject();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Đăng nhập thành công", user: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
  }
};
