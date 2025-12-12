// controllers/hotelController.js

const Hotel = require("../models/Hotel");

// ===================================================
// 1. CREATE - Đăng tải Khách sạn mới
// Endpoint: POST /api/admin/hotels/create
// ===================================================
const createNewHotel = async (req, res) => {
  try {
    const {
      tenKhachSan,
      moTa,
      tinhThanh,
      diaChiChiTiet,
      hangSao,
      loaiHinh,
      giaThapNhat,
      linkDatPhong,
      anhDaiDien,
    } = req.body;

    // 1. Kiểm tra thiếu trường dữ liệu
    if (
      !tenKhachSan ||
      !tinhThanh ||
      !diaChiChiTiet ||
      hangSao === undefined ||
      giaThapNhat === undefined ||
      !linkDatPhong ||
      !anhDaiDien
    ) {
      return res.status(400).json({
        message: "Vui lòng điền đầy đủ các trường bắt buộc của Khách sạn.",
      });
    }

    // 2. Tạo bản ghi mới
    const newHotel = new Hotel({
      tenKhachSan,
      moTa,
      tinhThanh,
      diaChiChiTiet,
      hangSao,
      loaiHinh,
      giaThapNhat,
      linkDatPhong,
      anhDaiDien,
    });

    await newHotel.save();

    res.status(201).json({
      message: "Đăng tải Khách sạn thành công!",
      hotel: newHotel,
    });
  } catch (err) {
    console.error("Lỗi khi đăng tải Khách sạn:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể đăng tải Khách sạn." });
  }
};

// ===================================================
// 2. READ ALL - Lấy tất cả Khách sạn
// Endpoint: GET /api/admin/hotels/
// ===================================================
const readAllHotels = async (req, res) => {
  try {
    const { search } = req.query; // Lấy tham số tìm kiếm từ URL (query)
    let query = {}; // Khởi tạo đối tượng truy vấn Mongoose

    if (search) {
      // Xây dựng query Mongoose để tìm kiếm không phân biệt hoa thường ('i')
      query.$or = [
        { tenKhachSan: { $regex: search, $options: "i" } },
        { tinhThanh: { $regex: search, $options: "i" } },
        { diaChiChiTiet: { $regex: search, $options: "i" } },
        { loaiHinh: { $regex: search, $options: "i" } }, // Có thể tìm theo loại hình (Resort, Homestay)
      ];
    } // Áp dụng query (nếu không có search, query là rỗng và trả về tất cả)

    const hotels = await Hotel.find(query).sort({ hangSao: -1, ngayTao: -1 });

    res.status(200).json({
      total: hotels.length,
      hotels,
    });
  } catch (err) {
    console.error("Lỗi khi lấy danh sách Khách sạn:", err);
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể tải danh sách Khách sạn." });
  }
};

// ===================================================
// 3. READ ONE - Lấy chi tiết Khách sạn theo ID
// Endpoint: GET /api/admin/hotels/:id
// ===================================================
const readOneHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: "Không tìm thấy Khách sạn." });
    }

    res.status(200).json({ hotel });
  } catch (err) {
    console.error("Lỗi khi lấy chi tiết Khách sạn:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Khách sạn không hợp lệ." });
    }
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể tải chi tiết Khách sạn." });
  }
};

// ===================================================
// 4. UPDATE - Cập nhật Khách sạn theo ID
// Endpoint: PUT /api/admin/hotels/:id
// ===================================================
const updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedHotel) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Khách sạn để cập nhật." });
    }

    res.status(200).json({
      message: "Cập nhật Khách sạn thành công!",
      hotel: updatedHotel,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật Khách sạn:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Khách sạn không hợp lệ." });
    }
    res
      .status(500)
      .json({ message: "Lỗi máy chủ. Không thể cập nhật Khách sạn." });
  }
};

// ===================================================
// 5. DELETE - Xóa Khách sạn theo ID
// Endpoint: DELETE /api/admin/hotels/:id
// ===================================================
const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

    if (!deletedHotel) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy Khách sạn để xóa." });
    }

    res.status(200).json({
      message: "Xóa Khách sạn thành công!",
      hotel: deletedHotel,
    });
  } catch (err) {
    console.error("Lỗi khi xóa Khách sạn:", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "ID Khách sạn không hợp lệ." });
    }
    res.status(500).json({ message: "Lỗi máy chủ. Không thể xóa Khách sạn." });
  }
};

module.exports = {
  createNewHotel,
  readAllHotels,
  readOneHotel,
  updateHotel,
  deleteHotel,
};
