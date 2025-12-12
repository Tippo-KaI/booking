import dns from "dns";
import nodemailer from "nodemailer";
import Verification from "../models/verification.js";

// 🧩 Kiểm tra domain của email có tồn tại không
export const checkEmailDomain = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Thiếu email" });

  const domain = email.split("@")[1];
  try {
    const records = await dns.promises.resolveMx(domain);
    if (!records || records.length === 0) {
      return res.status(400).json({ message: "Tên miền email không hợp lệ" });
    }
    next();
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Email không hợp lệ hoặc không tồn tại" });
  }
};

// 📩 Gửi mã xác minh (OTP) qua email
export const sendVerificationCode = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Thiếu email" });

  // Tạo mã OTP 6 chữ số
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Gắn tạm mã OTP vào request để sử dụng ở middleware/controller kế tiếp (nếu cần)
  req.verificationCode = code;

  // Lưu hoặc cập nhật mã xác minh vào MongoDB
  await Verification.findOneAndUpdate(
    { email },
    { code, expiresAt: new Date(Date.now() + 1 * 60 * 1000) },
    { upsert: true }
  );

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Xác minh đăng ký" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã xác minh đăng ký tài khoản",
      text: `Mã xác minh của bạn là: ${code}`,
    });

    console.log("✅ Đã gửi mã xác minh đến:", email);
    res
      .status(200)
      .json({ message: "Mã xác minh đã được gửi tới email của bạn" });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    return res.status(500).json({ message: "Không thể gửi email xác minh" });
  }
};
