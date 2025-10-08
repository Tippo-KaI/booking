// middlewares/verifyEmail.js
const dns = require("dns");
const nodemailer = require("nodemailer");
const Verification = require("../models/verification");

// Kiểm tra domain email tồn tại không
const checkEmailDomain = async (req, res, next) => {
  const { Email } = req.body;
  if (!Email) return res.status(400).json({ message: "Thiếu email" });

  const domain = Email.split("@")[1];
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

// Gửi mã xác minh qua email
const sendVerificationCode = async (req, res, next) => {
  const { Email } = req.body;

  // Tạo mã OTP 6 chữ số
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Tạo thêm trường verificationCode để “đính kèm tạm” giá trị mã OTP vào req
  req.verificationCode = code;

  await Verification.findOneAndUpdate(
    { Email }, // object literal: { Email: "..." }
    { code, expiresAt: new Date(Date.now() + 1 * 60 * 1000) }, // object literal: { code: "123456", expiresAt: "..." }
    { upsert: true } // object literal: { upsert: true }
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
      to: Email,
      subject: "Mã xác minh đăng ký tài khoản",
      text: `Mã xác minh của bạn là: ${code}`,
    });

    console.log("✅ Đã gửi mã xác minh đến:", Email);
    res
      .status(200)
      .json({ message: "Mã xác minh đã được gửi tới email của bạn" });
  } catch (error) {
    console.error("❌ Lỗi gửi email:", error);
    return res.status(500).json({ message: "Không thể gửi email xác minh" });
  }
};

module.exports = { checkEmailDomain, sendVerificationCode };
