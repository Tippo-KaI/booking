const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // 1. Lấy token từ header
  const authHeader = req.header("authorization");

  // 2. Kiểm tra xem header có tồn tại và đúng định dạng "Bearer [token]" không
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Không có token, không có quyền truy cập." });
  }

  // 3. Tách lấy token (bỏ chữ "Bearer " đi)
  const token = authHeader.split(" ")[1];

  // 4. Xác thực token
  try {
    // Dùng process.env.JWT_SECRET để giải mã
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 5. Gắn thông tin user (payload) vào request
    // Payload của bạn khi login là { id: user._id }
    // nên decoded sẽ là { id: '...' }
    req.user = decoded;

    // 6. Cho phép đi tiếp
    next();
  } catch (err) {
    // Bắt lỗi nếu token sai hoặc hết hạn
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn." });
  }
};

module.exports = auth;
