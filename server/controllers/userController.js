const User = require("../models/User");
const bcrypt = require("bcryptjs");
const dns = require("dns").promises;
const Verification = require("../models/verification");
const jwt = require("jsonwebtoken");

// Đăng ký
exports.registerUser = async (req, res) => {
  try {
    const {
      HoTen,
      NgaySinh,
      GioiTinh,
      DiaChi,
      DienThoai,
      Email,
      TenDangNhap,
      MatKhau,
    } = req.body;

    // Kiểm tra thông tin
    if (!HoTen || !NgaySinh || !Email || !TenDangNhap || !MatKhau) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }

    // Kiểm tra trùng email hoặc tên đăng nhập
    const existingUser = await User.findOne({
      $or: [{ Email }, { TenDangNhap }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email hoặc Tên đăng nhập đã tồn tại" });
    }

    const existingCode = await Verification.findOne({ Email });
    if (!existingCode || existingCode.code !== req.body.code) {
      return res
        .status(400)
        .json({ message: "Mã xác minh không hợp lệ hoặc đã hết hạn" });
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(MatKhau, 10);

    const user = new User({
      HoTen,
      NgaySinh: new Date(NgaySinh),
      GioiTinh,
      DiaChi,
      DienThoai,
      Email,
      TenDangNhap,
      MatKhau: hashedPassword,
    });

    await user.save();
    await Verification.deleteOne({ Email });

    // Xóa mật khẩu khi trả về
    const { MatKhau: pw, ...userData } = user.toObject();

    res.status(201).json({ message: "Đăng ký thành công", user: userData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy danh sách user
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-MatKhau"); // Ẩn mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Đăng nhập
exports.loginUser = async (req, res) => {
  try {
    const { TaiKhoan, MatKhau } = req.body;
    // TaiKhoan có thể là Email hoặc TenDangNhap

    if (!TaiKhoan || !MatKhau) {
      return res
        .status(400)
        .json({ message: "Thiếu Email/Tên đăng nhập hoặc Mật khẩu" });
    }

    // Tìm theo Email hoặc TenDangNhap
    const user = await User.findOne({
      $or: [{ Email: TaiKhoan }, { TenDangNhap: TaiKhoan }],
    });

    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(MatKhau, user.MatKhau);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Ẩn mật khẩu khi trả về
    const { MatKhau: pw, ...userData } = user.toObject();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Đăng nhập thành công", user: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
  }
};
