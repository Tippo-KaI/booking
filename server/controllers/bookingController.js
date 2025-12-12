// controllers/bookingController.js

const TourBooking = require("../models/TourBooking");
const Tour = require("../models/Tour"); // Cần require Model Tour

// ===================================================
// 1. CREATE - Gửi Yêu cầu Đặt Tour (User)
// Endpoint: POST /api/bookings/tour
// ===================================================
exports.createTourBooking = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ JWT (đã qua auth middleware)
    const {
      tourId,
      hoTenKhach,
      emailKhach,
      dienThoaiKhach,
      ngayKhoiHanh,
      soLuongNguoi,
      ghiChu,
    } = req.body; // Kiểm tra dữ liệu đầu vào bắt buộc

    if (
      !tourId ||
      !ngayKhoiHanh ||
      !soLuongNguoi ||
      !hoTenKhach ||
      !emailKhach
    ) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin đặt tour bắt buộc." });
    } // Lấy thông tin Tour gốc để tính toán và đóng băng giá

    const tour = await Tour.findById(tourId);

    if (!tour || !tour.giaCoBan) {
      return res.status(404).json({
        message: "Tour không tồn tại hoặc thiếu thông tin giá cơ bản.",
      });
    }

    const giaCoBan = tour.giaCoBan;
    const tongChiPhi = giaCoBan * soLuongNguoi;

    const newBooking = new TourBooking({
      tourId,
      tenTour: tour.tenTour,
      userId,
      hoTenKhach,
      emailKhach,
      dienThoaiKhach,
      ngayKhoiHanh: new Date(ngayKhoiHanh),
      soLuongNguoi,
      ghiChu,
      giaCoBan,
      tongChiPhi,
      thoiGianTour: tour.thoiGian || "Chưa rõ",
      trangThai: "Pending",
    });

    await newBooking.save();

    res.status(201).json({
      message: `✅ Yêu cầu đặt tour [Tổng phí: ${tongChiPhi.toLocaleString(
        "vi-VN"
      )} VNĐ] đã được gửi.`,
      booking: newBooking,
    });
  } catch (err) {
    console.error("Lỗi khi tạo Booking:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi tạo Booking." });
  }
};

// ===================================================
// 2. READ ALL - Lấy danh sách Bookings (Admin View)
// Endpoint: GET /api/bookings/admin/tours
// ===================================================
exports.getAllTourBookings = async (req, res) => {
  try {
    const bookings = await TourBooking.find()
      .populate("tourId", "tenTour")
      .populate("userId", "email hoTen")
      .sort({ ngayTao: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Bookings:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi tải danh sách Booking." });
  }
};

// ===================================================
// 3. READ ONE - Lấy chi tiết Booking theo ID (Admin/User)
// Endpoint: GET /api/bookings/:id
// ===================================================
exports.readOneBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await TourBooking.findById(bookingId)
      .populate("tourId", "tenTour thoiGian")
      .populate("userId", "email hoTen");

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy Booking." });
    }

    // Phân quyền cơ bản: Chỉ Admin HOẶC chủ sở hữu mới được xem
    const isAdmin = req.user && req.user.role === "admin";
    const isOwner =
      booking.userId && booking.userId._id.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xem Booking này." });
    }

    res.status(200).json({ booking });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết Booking:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Booking không hợp lệ." });
    }
    res.status(500).json({ message: "Lỗi máy chủ khi tải chi tiết Booking." });
  }
};

// ===================================================
// 4. READ MY BOOKINGS - Lấy đơn hàng của Khách hàng
// Endpoint: GET /api/bookings/my-tours
// ===================================================
exports.readMyBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID của người dùng đang đăng nhập (từ auth middleware)

    const myBookings = await TourBooking.find({ userId: userId })
      .populate("tourId", "tenTour")
      .sort({ ngayTao: -1 });

    res.status(200).json({ bookings: myBookings });
  } catch (err) {
    console.error("Lỗi khi lấy đơn hàng của tôi:", err);
    res.status(500).json({ message: "Lỗi máy chủ khi tải đơn hàng." });
  }
};

// ===================================================
// 5. UPDATE - Cập nhật Trạng thái Booking (Admin Action)
// Endpoint: PUT /api/bookings/admin/tours/:id
// ===================================================
exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { trangThai } = req.body;

    if (
      !trangThai ||
      !["Pending", "Confirmed", "Completed", "Cancelled"].includes(trangThai)
    ) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ." });
    }

    const updatedBooking = await TourBooking.findByIdAndUpdate(
      bookingId,
      { trangThai, ngayCapNhat: Date.now() },
      { new: true }
    );

    if (!updatedBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Booking để cập nhật." });
    }

    res.status(200).json({
      message: `Cập nhật trạng thái Booking thành công thành: ${trangThai}`,
      booking: updatedBooking,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật trạng thái Booking:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Booking không hợp lệ." });
    }
    res.status(500).json({ message: "Lỗi máy chủ khi cập nhật trạng thái." });
  }
};

// Gói tất cả các hàm và export
module.exports = {
  createTourBooking: exports.createTourBooking,
  getAllTourBookings: exports.getAllTourBookings,
  readOneBooking: exports.readOneBooking,
  readMyBookings: exports.readMyBookings, // 👈 Đã thêm
  updateBookingStatus: exports.updateBookingStatus,
};
