const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.updateUser = async (req, res) => {
  try {
    const updateData = { ...req.body }; // <<< Sửa lỗi khoảng trắng

    // Logic xử lý file của bạn vẫn đúng
    if (req.files.avatar)
      updateData.avatar = `/uploads/${req.files.avatar[0].filename}`;
    if (req.files.cccdTruoc)
      updateData.cccdTruoc = `/uploads/${req.files.cccdTruoc[0].filename}`;
    if (req.files.cccdSau)
      updateData.cccdSau = `/uploads/${req.files.cccdSau[0].filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Lỗi máy chủ: " + err.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Ẩn mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // taiKhoan có thể là email hoặc tenDangNhap

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu Email hoặc Mật khẩu" });
    }

    // Tìm theo email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Tài khoản không tồn tại" });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Sai mật khẩu" });
    }

    // Ẩn mật khẩu khi trả về
    const { password: pw, ...userData } = user.toObject();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Đăng nhập thành công", user: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
  }
};
