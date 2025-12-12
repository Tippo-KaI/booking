// Cập nhật controllers/invoiceController.js

const Invoice = require("../models/Invoice");
const TourBooking = require("../models/TourBooking");

// Hàm tạo mã hóa đơn tự động (Giả lập)
const generateInvoiceCode = () => {
  const prefix = "INV";
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${datePart}-${randomPart}`;
};

// ===================================================
// 1. CREATE - Tạo Hóa đơn từ Booking (Admin Action)
// ... (Giữ nguyên hàm generateInvoice)
// ===================================================
const generateInvoice = async (req, res) => {
  // ... (Code đã có)
};

// ===================================================
// 2. READ ONE - Lấy chi tiết Hóa đơn (Admin/User View)
// Endpoint: GET /api/invoices/:id
// ===================================================
const getInvoiceById = async (req, res) => {
  try {
    const invoiceId = req.params.id;

    // Populate bookingId để lấy thông tin chi tiết Tour/Người đặt
    const invoice = await Invoice.findById(invoiceId).populate({
      path: "bookingId",
      select:
        "tenTour ngayKhoiHanh soLuongNguoi giaCoBan tongChiPhi thoiGianTour",
      populate: {
        path: "userId", // Có thể populate thêm User nếu cần
        select: "hoTen email",
      },
    });

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy Hóa đơn." });
    }

    // LƯU Ý: Nếu đây là route cho User, cần kiểm tra invoice.bookingId.userId._id có khớp với req.user.id không.

    res.status(200).json({ invoice });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết Hóa đơn:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Hóa đơn không hợp lệ." });
    }
    res.status(500).json({ message: "Lỗi máy chủ khi tải Hóa đơn." });
  }
};

// ===================================================
// 3. READ ALL - Lấy danh sách Hóa đơn (Admin View)
// Endpoint: GET /api/admin/invoices
// ===================================================
const getAllInvoices = async (req, res) => {
  try {
    // 1. Tìm tất cả hóa đơn và dùng .lean() để chuyển thành đối tượng JS thuần
    // Điều này giúp hiệu suất tốt hơn và tránh một số vấn đề phức tạp của Mongoose Object
    let invoices = await Invoice.find().lean().sort({ ngayXuat: -1 });

    // 2. Thực hiện populate. Mongoose v7+ có thể xử lý CastError tốt hơn,
    // nhưng nếu bạn dùng phiên bản cũ, lỗi CastError khi populate có thể bị bỏ qua nếu không dùng promise.all
    // Tuy nhiên, cách tốt nhất là để Mongoose xử lý lỗi và đảm bảo format lỗi là JSON.

    // Giữ nguyên đoạn code populate như cũ, nhưng đảm bảo server trả về JSON 500 nếu lỗi.
    // (Controller của bạn đã có res.status(500).json(...) nên về mặt code là đúng)

    invoices = await Invoice.populate(invoices, {
      path: "bookingId",
      select: "tenTour ngayKhoiHanh",
    });

    res.status(200).json({ invoices });
  } catch (err) {
    console.error("LỖI POPULATE DỮ LIỆU BỊ HỎNG:", err); // Frontend sẽ nhận được lỗi 500 JSON.
    // Nếu lỗi là CastError do ID Booking không hợp lệ trong DB, nó sẽ rơi vào đây.
    res.status(500).json({
      message:
        "Lỗi máy chủ khi tải danh sách Hóa đơn (Lỗi Dữ liệu DB). Vui lòng kiểm tra log server.",
    });
  }
};

// ===================================================
// 4. UPDATE - Cập nhật Trạng thái Thanh toán (Admin Action)
// ... (Giữ nguyên hàm updatePaymentStatus)
// ===================================================
const updatePaymentStatus = async (req, res) => {
  // ... (Code đã có)
};

// ===================================================
// EXPORTS MODULES
// ===================================================
module.exports = {
  generateInvoice,
  getInvoiceById, // Export mới
  getAllInvoices, // Export mới
  updatePaymentStatus,
};
