// src/pages/TourDetailPage.jsx (Đã Tích hợp Form Đặt Tour)

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  RiLoader4Line,
  RiMapPinLine,
  RiCalendarLine,
  RiMoneyEuroBoxLine,
  RiTimeLine,
  RiTicketLine,
  RiDirectionLine,
  RiPriceTag3Line,
  RiHotelLine,
  RiGroupLine,
  RiQuillPenLine,
  RiSendPlaneLine,
} from "react-icons/ri";

const API_BASE = "http://localhost:5000/api/";
const API_TOUR_DETAIL = `${API_BASE}tours/`;
const API_BOOKING = `${API_BASE}bookings/tour`;

// DỮ LIỆU GIẢ LẬP VỀ KHÁCH SẠN + HỆ SỐ GIÁ
const mockHotels = [
  { id: "h1", name: "Standard (3 sao)", priceMultiplier: 1.0 },
  { id: "h2", name: "Superior (4 sao)", priceMultiplier: 1.25 },
  { id: "h3", name: "Deluxe (5 sao)", priceMultiplier: 1.5 },
  { id: "h4", name: "Tự túc / Khác", priceMultiplier: 0.8 },
];

const TourDetailPage = () => {
  const { tourId } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false); // Trạng thái Submit
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(""); // Message cho Form Booking

  const [formData, setFormData] = useState({
    hoTenKhach: "",
    emailKhach: "",
    dienThoaiKhach: "",
    ngayKhoiHanh: "",
    soLuongNguoi: 1,
    ghiChu: "",
    khachSanChon: mockHotels[0].id,
  });

  // LOGIC TÍNH GIÁ ĐỘNG
  const giaCoBan = tour?.giaCoBan || 0;
  const hotelSelected = mockHotels.find((h) => h.id === formData.khachSanChon);
  const heSoKhachSan = hotelSelected?.priceMultiplier || 1;
  const soLuongNguoi = Number(formData.soLuongNguoi);
  const tongChiPhi = giaCoBan * soLuongNguoi * heSoKhachSan;

  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") + " VNĐ" : "Liên hệ";
  };

  // Tính phụ phí KS/người
  const extraFeePerPerson = heSoKhachSan * giaCoBan - giaCoBan;

  // --- LOGIC FETCH CHI TIẾT TOUR ---
  useEffect(() => {
    const fetchTourDetail = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_TOUR_DETAIL}${tourId}`);
        const data = await res.json();

        if (res.ok && data.tour) {
          setTour(data.tour);
        } else {
          setError(data.message || "Không tìm thấy Tour.");
        }
      } catch (err) {
        setError("Lỗi kết nối Server khi tải chi tiết Tour.");
      } finally {
        setLoading(false);
      }
    };
    if (tourId) {
      fetchTourDetail();
    }
  }, [tourId]);

  // --- XỬ LÝ FORM BOOKING ---
  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "soLuongNguoi") {
      value = Math.max(1, parseInt(value) || 1);
    }
    setFormData({ ...formData, [e.target.name]: value });
    setMessage(""); // Xóa thông báo khi người dùng thay đổi input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("❌ Vui lòng đăng nhập để gửi yêu cầu đặt tour.");
      setLoadingSubmit(false);
      return;
    }
    if (soLuongNguoi < 1) {
      setLoadingSubmit(false);
      return setMessage("❌ Số lượng người tối thiểu phải là 1.");
    }

    // Tạo ghi chú cuối cùng
    const hotelName = hotelSelected ? hotelSelected.name : "N/A";
    const finalGhiChu = `[Khách sạn: ${hotelName} (Hệ số: ${heSoKhachSan})] ${formData.ghiChu}`;

    try {
      const res = await fetch(API_BOOKING, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tourId: tourId,
          soLuongNguoi: soLuongNguoi,
          tongChiPhi: tongChiPhi, // Gửi giá trị tính toán
          giaCoBan: giaCoBan,
          ghiChu: finalGhiChu,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        // Chuyển hướng sang trang xác nhận Booking
        setTimeout(
          () => navigate(`/bookingconfirmation/${data.booking._id}`),
          1000
        );
      } else {
        setMessage(
          `❌ Lỗi: ${data.message || "Không thể tạo yêu cầu Booking."}`
        );
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối Server khi gửi yêu cầu.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  // --- HIỂN THỊ CÁC TRẠNG THÁI ---
  if (loading) {
    return (
      <Header>
        <div className="text-center py-20 text-blue-600 font-semibold">
          <RiLoader4Line className="animate-spin w-6 h-6 inline mr-2" /> Đang
          tải thông tin Tour...
        </div>
      </Header>
    );
  }

  if (error || !tour) {
    return (
      <Header>
        <div className="text-center py-20 text-red-600 font-semibold">
          {error || "Tour không tồn tại hoặc đã bị xóa."}
        </div>
      </Header>
    );
  }

  // --- GIAO DIỆN CHÍNH ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto max-w-6xl py-10 px-4">
        {/* 1. HEADER VÀ ẢNH ĐẠI DIỆN */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
          <h1 className="text-4xl font-extrabold mb-4 text-slate-800 leading-tight">
            {tour.tenTour}
          </h1>
          <div className="flex items-center gap-4 text-lg text-gray-600 mb-6">
            <span className="flex items-center gap-1 font-semibold text-blue-600">
              <RiMapPinLine /> {tour.diaDiem}
            </span>
            <span className="flex items-center gap-1">
              <RiTimeLine /> {tour.thoiGian || "Chưa rõ"}
            </span>
            <span className="flex items-center gap-1">
              <RiTicketLine /> {tour.loaiHinh || "Du lịch"}
            </span>
          </div>

          <img
            src={
              tour.anhDaiDien ||
              "https://via.placeholder.com/1200x400?text=Tour+Detail+Image"
            }
            alt={tour.tenTour}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 2. CỘT NỘI DUNG (Mô tả, Lịch trình) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <RiDirectionLine /> Mô tả Tour
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {tour.moTa || "Hiện chưa có mô tả chi tiết cho tour này."}
              </p>
            </div>
          </div>

          {/* 3. CỘT SIDEBAR (TÍCH HỢP FORM ĐẶT TOUR) */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 bg-white p-6 rounded-xl shadow-2xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                <RiSendPlaneLine /> Gửi Yêu Cầu Đặt Tour
              </h3>

              {/* MESSAGE ALERT CHO FORM */}
              {message && (
                <div
                  className={`p-3 mb-4 rounded-lg font-medium text-sm ${
                    message.startsWith("✅")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-semibold text-gray-700">
                  Thông tin Khách hàng:
                </h4>
                <input
                  type="text"
                  name="hoTenKhach"
                  value={formData.hoTenKhach}
                  onChange={handleChange}
                  placeholder="Họ tên"
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <input
                  type="email"
                  name="emailKhach"
                  value={formData.emailKhach}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <input
                  type="text"
                  name="dienThoaiKhach"
                  value={formData.dienThoaiKhach}
                  onChange={handleChange}
                  placeholder="SĐT"
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                />

                <h4 className="font-semibold text-gray-700 pt-2 border-t">
                  Chi tiết Tour:
                </h4>
                <label className="block text-xs font-medium mb-1">
                  Ngày Khởi hành:
                </label>
                <input
                  type="date"
                  name="ngayKhoiHanh"
                  value={formData.ngayKhoiHanh}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                />

                <label className="block text-xs font-medium mb-1 flex items-center gap-1">
                  <RiGroupLine /> Số lượng người:
                </label>
                <input
                  type="number"
                  name="soLuongNguoi"
                  min="1"
                  value={formData.soLuongNguoi}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-lg text-sm"
                />

                <label className="block text-xs font-medium mb-1 flex items-center gap-1">
                  <RiHotelLine /> Hạng Khách sạn:
                </label>
                <select
                  name="khachSanChon"
                  value={formData.khachSanChon}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg text-sm bg-white"
                >
                  {mockHotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name} (x {hotel.priceMultiplier})
                    </option>
                  ))}
                </select>

                <label className="block text-xs font-medium mb-1 flex items-center gap-1">
                  <RiQuillPenLine /> Ghi chú:
                </label>
                <textarea
                  name="ghiChu"
                  value={formData.ghiChu}
                  onChange={handleChange}
                  placeholder="Yêu cầu thêm"
                  rows="2"
                  className="w-full p-2 border rounded-lg text-sm mb-4"
                />

                {/* TỔNG CHI PHÍ */}
                <div className="py-3 border-t border-b mb-4">
                  <p className="text-xl font-bold text-red-600 flex justify-between">
                    <span>TỔNG ƯỚC TÍNH:</span>
                    <span>{formatCurrency(tongChiPhi)}</span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loadingSubmit || soLuongNguoi < 1}
                  className="w-full py-3 bg-red-600 text-white font-semibold text-lg rounded-lg shadow-md transition hover:bg-red-700"
                >
                  {loadingSubmit ? "Đang gửi..." : "ĐẶT TOUR"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
