import Tour from "../models/tour.js"; // Viết hoa T cho đồng nhất

// 🟢 Lấy danh sách tour (chỉ hiển thị tour chưa đầy)
export const getTours = async (req, res) => {
  try {
    const tours = await Tour.find({ daDay: { $ne: true } });
    res.status(200).json(tours);
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách tour:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour",
      error: error.message,
    });
  }
};

// 🟢 Tạo tour mới
export const createTour = async (req, res) => {
  try {
    console.log("📥 Dữ liệu nhận từ client:", req.body);
    console.log("📸 File upload:", req.file);

    const {
      tenTour,
      diaDiem,
      ngayKhoiHanh,
      soNgay,
      gia,
      moTa,
      soLuongKhachToiDa,
      anUong,
      khuVucThamQuan,
    } = req.body;

    // ✅ Kiểm tra các trường bắt buộc
    if (
      !tenTour ||
      !diaDiem ||
      !ngayKhoiHanh ||
      !soNgay ||
      !gia ||
      !soLuongKhachToiDa ||
      !khuVucThamQuan
    ) {
      return res.status(400).json({
        message: "⚠️ Vui lòng điền đầy đủ thông tin tour.",
      });
    }

    // ✅ Chuyển dữ liệu sang đúng kiểu
    const giaNum = Number(gia);
    const soNgayNum = Number(soNgay);
    const soLuongKhachToiDaNum = Number(soLuongKhachToiDa);

    if (
      Number.isNaN(giaNum) ||
      Number.isNaN(soNgayNum) ||
      Number.isNaN(soLuongKhachToiDaNum)
    ) {
      return res.status(400).json({
        message:
          "⚠️ Các trường giá, số ngày và số lượng khách phải là số hợp lệ.",
      });
    }

    // ✅ Chuẩn hóa giá trị anUong
    const mapAnUong = {
      buffet: "Buffet",
      "set menu": "Set menu",
      setmenu: "Set menu",
      "tự túc": "Tự túc",
      "tu tuc": "Tự túc",
      tutuc: "Tự túc",
    };

    const rawAnUong = (anUong || "").toString().trim().toLowerCase();
    const anUongNormalized = mapAnUong[rawAnUong] || anUong;

    const validAnUong = ["Set menu", "Tự túc", "Buffet"];
    if (!validAnUong.includes(anUongNormalized)) {
      return res.status(400).json({
        message: `⚠️ Giá trị ăn uống không hợp lệ. Chỉ chấp nhận: ${validAnUong.join(
          ", "
        )}`,
      });
    }

    // ✅ Xử lý ảnh upload
    const hinhAnh = req.file?.filename || null;

    // ✅ Tạo đối tượng Tour mới
    const newTour = new Tour({
      tenTour,
      diaDiem,
      ngayKhoiHanh: new Date(ngayKhoiHanh),
      soNgay: soNgayNum,
      gia: giaNum,
      moTa,
      hinhAnh,
      soLuongKhachToiDa: soLuongKhachToiDaNum,
      anUong: anUongNormalized,
      khuVucThamQuan,
      soLuongDaDangKy: 0,
      daDay: false,
    });

    console.log("💾 Chuẩn bị lưu tour vào MongoDB...");
    await newTour.save();
    console.log("✅ Tour mới đã được thêm:", newTour);

    return res.status(201).json({
      message: "🎉 Thêm tour thành công!",
      tour: newTour,
    });
  } catch (err) {
    console.error("❌ Lỗi khi tạo tour:", err?.message || err);
    console.error("📄 Toàn bộ lỗi:", err);
    console.error("📂 Stack Trace:", err.stack);

    // 🧩 Hiển thị chi tiết ValidationError
    if (err?.name === "ValidationError" && err.errors) {
      console.error("🧩 Chi tiết lỗi xác thực:");
      for (const [field, e] of Object.entries(err.errors)) {
        console.error(
          ` - ${field}: ${e.message} | Giá trị: ${JSON.stringify(e.value)}`
        );
      }

      // Trả lỗi chi tiết về client
      return res.status(400).json({
        message: "❌ Xác thực dữ liệu thất bại (ValidationError)",
        errors: Object.fromEntries(
          Object.entries(err.errors).map(([k, v]) => [k, v.message])
        ),
      });
    }

    // 🧩 Trường hợp lỗi khác (CastError, MongoError...)
    return res.status(500).json({
      message: "❌ Lỗi khi tạo tour",
      error: err?.message || "Lỗi máy chủ không xác định",
    });
  }
};

// 🟡 Cập nhật số lượng khách đăng ký
export const registerCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { soLuongDangKy } = req.body;

    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Không tìm thấy tour" });
    }

    const soLuong = Number(soLuongDangKy);
    if (Number.isNaN(soLuong) || soLuong <= 0) {
      return res
        .status(400)
        .json({ message: "⚠️ Số lượng đăng ký không hợp lệ." });
    }

    tour.soLuongDaDangKy += soLuong;

    if (tour.soLuongDaDangKy >= tour.soLuongKhachToiDa) {
      tour.soLuongDaDangKy = tour.soLuongKhachToiDa;
      tour.daDay = true;
      console.log(`⚠️ Tour "${tour.tenTour}" đã đầy, sẽ ẩn khỏi danh sách.`);
    }

    await tour.save();
    console.log(
      `✅ Cập nhật số lượng đăng ký tour "${tour.tenTour}" thành công.`
    );
    res.status(200).json(tour);
  } catch (error) {
    console.error("❌ Lỗi khi đăng ký khách:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật khách đăng ký",
      error: error.message,
    });
  }
};

// 🔴 Xoá tour
export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Tour.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Không tìm thấy tour để xóa" });
    }

    console.log("🗑️ Tour đã được xóa:", deleted.tenTour);
    res
      .status(200)
      .json({ message: `Đã xóa tour "${deleted.tenTour}" thành công.` });
  } catch (error) {
    console.error("❌ Lỗi khi xóa tour:", error);
    res.status(500).json({
      message: "Lỗi khi xóa tour",
      error: error.message,
    });
  }
};
