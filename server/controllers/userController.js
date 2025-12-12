import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUserInfo = async (req, res) => {
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

// Lấy danh sách user
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Ẩn mật khẩu
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ message: "Đăng nhập thành công", user: userData, token });
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
  }
};
