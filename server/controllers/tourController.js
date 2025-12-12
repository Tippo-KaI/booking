// controllers/tourController.js

const Tour = require("../models/Tour");

// ===================================================
// Hàm Create (Đăng tải Tour mới)
// Endpoint: POST /api/tours/create
// ===================================================
const createNewTour = async (req, res) => {
  try {
    const {
      tenTour,
      diaDiem,
      moTa,
      anhDaiDien,
      loaiHinh,
      // 💡 TRƯỜNG MỚI:
      giaCoBan, // Giá cố định
      thoiGian, // Số ngày/thời lượng cố định
    } = req.body; // Cập nhật kiểm tra thiếu trường dữ liệu bắt buộc

    if (
      !tenTour ||
      !diaDiem ||
      !giaCoBan || // Kiểm tra giá
      !thoiGian || // Kiểm tra thời gian
      !anhDaiDien ||
      !moTa ||
      !loaiHinh
    ) {
      return res.status(400).json({
        message:
          "Vui lòng điền đầy đủ Tên, Địa điểm, Mô tả, Giá, Thời gian và Ảnh đại diện.",
      });
    }

    // Kiểm tra định dạng giá
    if (isNaN(giaCoBan) || Number(giaCoBan) <= 0) {
      return res
        .status(400)
        .json({ message: "Giá cơ bản phải là số dương hợp lệ." });
    }

    const newTour = new Tour({
      tenTour,
      diaDiem,
      moTa,
      // 💡 TRƯỜNG MỚI
      giaCoBan: Number(giaCoBan), // Lưu dưới dạng Number
      thoiGian,
      // 💡 TRƯỜNG CŨ BỊ BỎ: linkAffiliate, nganSach đã được loại bỏ

      anhDaiDien,
      loaiHinh,
    });

    await newTour.save();

    res.status(201).json({
      message: "Đăng tải Tour thành công!",
      tour: newTour,
    });
  } catch (err) {
    console.error("Lỗi khi đăng tải Tour:", err);
    res.status(500).json({ message: "Lỗi máy chủ. Không thể đăng tải Tour." });
  }
};

// ===================================================
// HÀM R (READ ALL) - Lấy tất cả Tours
// Endpoint: GET /api/tours/
// ===================================================
const readAllTours = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Xây dựng query Mongoose để tìm kiếm theo các trường mới
      query.$or = [
        { tenTour: { $regex: search, $options: "i" } },
        { diaDiem: { $regex: search, $options: "i" } },
        { loaiHinh: { $regex: search, $options: "i" } },
        // { thoiGian: { $regex: search, $options: "i" } }, // Có thể thêm nếu cần tìm kiếm theo thời gian
      ];
    }

    const tours = await Tour.find(query).sort({ ngayTao: -1 });

    res.status(200).json({
      total: tours.length,
      tours,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Tour:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể tải danh sách Tour." });
  }
};

// ===================================================
// 💡 HÀM R (READ ONE) - Lấy chi tiết Tour theo ID (ĐÃ THÊM)
// Endpoint: GET /api/tours/:id
// ===================================================
const readOneTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findById(tourId);

    if (!tour) {
      return res.status(404).json({ message: "Không tìm thấy Tour." });
    }

    res.status(200).json({ tour });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết Tour:", err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Tour không hợp lệ." });
    }

    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể tải chi tiết Tour." });
  }
};

// ===================================================
// HÀM U (UPDATE) - Cập nhật Tour theo ID
// Endpoint: PUT /api/tours/:id
// ===================================================
const updateTour = async (req, res) => {
  try {
    const tourId = req.params.id;
    // req.body giờ chứa giaCoBan và thoiGian (và không chứa linkAffiliate/nganSach)

    const updatedTour = await Tour.findByIdAndUpdate(tourId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Tour để cập nhật." });
    }

    res.status(200).json({
      message: "Cập nhật Tour thành công!",
      tour: updatedTour,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật Tour:", err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Tour không hợp lệ." });
    }
    // Xử lý lỗi validation (ví dụ: giá không phải là số)
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    res.status(500).json({ message: "Lỗi máy chủ. Không thể cập nhật Tour." });
  }
};

// ===================================================
// HÀM D (DELETE) - Xóa Tour theo ID
// Endpoint: DELETE /api/tours/:id
// ===================================================
const deleteTour = async (req, res) => {
  try {
    const tourId = req.params.id;

    const deletedTour = await Tour.findByIdAndDelete(tourId);

    if (!deletedTour) {
      return res.status(404).json({ message: "Không tìm thấy Tour để xóa." });
    }

    res.status(200).json({
      message: "Xóa Tour thành công!",
      tour: deletedTour,
    });
  } catch (err) {
    console.error("Lỗi khi xóa Tour:", err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Tour không hợp lệ." });
    }

    res.status(500).json({ message: "Lỗi máy chủ. Không thể xóa Tour." });
  }
};

// Cập nhật module.exports để bao gồm tất cả các hàm
module.exports = {
  createNewTour,
  readAllTours,
  readOneTour,
  updateTour,
  deleteTour,
};
