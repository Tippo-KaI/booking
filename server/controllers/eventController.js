// controllers/eventController.js

const Event = require("../models/Event");

// ===================================================
// CREATE - Đăng tải Sự kiện mới
// Endpoint: POST /api/admin/events/create
// ===================================================
const createNewEvent = async (req, res) => {
  try {
    const {
      tenSuKien,
      moTa,
      ngayBatDau,
      ngayKetThuc,
      tinhThanh,
      diaDiemCuThe,
      anhDaiDien,
    } = req.body; // 1. Kiểm tra thiếu trường dữ liệu quan trọng

    if (
      !tenSuKien ||
      !ngayBatDau ||
      !ngayKetThuc ||
      !tinhThanh ||
      !diaDiemCuThe
    ) {
      return res.status(400).json({
        message:
          "Vui lòng điền đầy đủ Tên, Ngày bắt đầu/kết thúc, Tỉnh/Thành phố và Địa điểm cụ thể.",
      });
    } // 2. Tạo bản ghi Sự kiện mới

    const newEvent = new Event({
      tenSuKien,
      moTa,
      ngayBatDau,
      ngayKetThuc,
      tinhThanh, // Lưu Tỉnh/Thành phố để lọc
      diaDiemCuThe,
      anhDaiDien,
    });

    await newEvent.save();

    res.status(201).json({
      message: "Đăng tải Sự kiện thành công!",
      event: newEvent,
    });
  } catch (err) {
    console.error("Lỗi khi đăng tải Sự kiện:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể đăng tải Sự kiện." });
  }
};

// ===================================================
// READ ALL - Lấy tất cả Sự kiện
// Endpoint: GET /api/admin/events/
// ===================================================
const readAllEvents = async (req, res) => {
  try {
    // Lấy tất cả, sắp xếp theo ngày bắt đầu gần nhất
    const events = await Event.find().sort({ ngayBatDau: 1 });

    res.status(200).json({
      total: events.length,
      events,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Sự kiện:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể tải danh sách Sự kiện." });
  }
};

// ===================================================
// 💡 HÀM R (READ ONE) - Lấy chi tiết Sự kiện theo ID (ĐÃ THÊM)
// Endpoint: GET /api/admin/events/:id
// ===================================================
const readOneEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId); // Tìm theo ID

    if (!event) {
      return res.status(404).json({ message: "Không tìm thấy Sự kiện." });
    }

    res.status(200).json({ event }); // Trả về object event (để Frontend lấy data.event)
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết Sự kiện:", err);

    // Xử lý lỗi khi ID không đúng định dạng (Mongoose CastError)
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Sự kiện không hợp lệ." });
    }

    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể tải chi tiết Sự kiện." });
  }
};

// ===================================================
// UPDATE - Cập nhật Sự kiện theo ID
// Endpoint: PUT /api/admin/events/:id
// ===================================================
const updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedEvent) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Sự kiện để cập nhật." });
    }

    // Xử lý lỗi khi ID không đúng định dạng (Mongoose CastError)
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Sự kiện không hợp lệ." });
    }

    res.status(200).json({
      message: "Cập nhật Sự kiện thành công!",
      event: updatedEvent,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật Sự kiện:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể cập nhật Sự kiện." });
  }
};

// ===================================================
// DELETE - Xóa Sự kiện theo ID
// Endpoint: DELETE /api/admin/events/:id
// ===================================================
const deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Sự kiện để xóa." });
    }

    // Xử lý lỗi khi ID không đúng định dạng (Mongoose CastError)
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Sự kiện không hợp lệ." });
    }

    res.status(200).json({
      message: "Xóa Sự kiện thành công!",
      event: deletedEvent,
    });
  } catch (err) {
    console.error("Lỗi khi xóa Sự kiện:", err);
    res.status(500).json({ message: "Lỗi máy chủ. Không thể xóa Sự kiện." });
  }
};

module.exports = {
  createNewEvent,
  readAllEvents,
  readOneEvent, // 👈 ĐÃ THÊM
  updateEvent,
  deleteEvent,
};
