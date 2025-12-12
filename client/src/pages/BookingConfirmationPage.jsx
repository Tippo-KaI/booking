// src/pages/BookingConfirmationPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import {
  RiLoader4Line,
  RiCheckDoubleFill,
  RiTimeLine,
  RiMoneyEuroBoxLine,
  RiFileList3Line,
  RiCalendarCheckLine,
  RiQrCodeLine,
  RiBankCardLine,
  RiErrorWarningLine,
  RiUser3Line,
  RiMailLine,
  RiPhoneLine,
  RiCloseCircleFill,
  RiSendPlaneFill, // Icon mới cho nút Xác nhận
} from "react-icons/ri";

const API_BOOKING_DETAIL = "http://localhost:5000/api/bookings/";
const API_UPDATE_BOOKING_STATUS =
  "http://localhost:5000/api/bookings/admin/tours/";

// MOCK DATA MÃ QR TĨNH
const MOCK_QR_CODE =
  "https://via.placeholder.com/150?text=QR+Code+Chuyen+Khoan";
const BANK_ACCOUNT = "1234567890 (VIETCOMBANK)";
const BANK_HOLDER = "NHÓM 14";

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(null);

  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") + " VNĐ" : "0 VNĐ";
  };

  const formatDate = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })
      : "N/A";
  };

  // --- FETCH CHI TIẾT BOOKING (Logic giữ nguyên) ---
  useEffect(() => {
    const fetchBookingDetail = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập để xem chi tiết đơn hàng.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BOOKING_DETAIL}${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          setBooking(data.booking);
        } else {
          setError(data.message || "Không tìm thấy chi tiết đơn hàng.");
        }
      } catch (err) {
        setError("Lỗi kết nối Server khi tải chi tiết Booking.");
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) {
      fetchBookingDetail();
    }
  }, [bookingId]);

  // --- HÀM XỬ LÝ THANH TOÁN QR ---
  const handleQrPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Vui lòng đăng nhập lại để xác nhận.");

    if (
      booking.trangThai === "Confirmed" ||
      booking.trangThai === "Completed"
    ) {
      return alert("Đơn hàng đã được xử lý.");
    }

    const confirmation = window.confirm(
      "XÁC NHẬN: Bạn đã hoàn tất việc chuyển khoản và muốn chuyển trạng thái Đơn hàng sang ĐÃ THANH TOÁN (Confirmed)? \n(LƯU Ý: Admin sẽ kiểm tra và xác nhận cuối cùng)."
    );

    if (!confirmation) return;

    setUpdateStatus({
      loading: true,
      message: "Đang gửi yêu cầu xác nhận thanh toán...",
    });

    try {
      const res = await fetch(`${API_UPDATE_BOOKING_STATUS}${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trangThai: "Confirmed" }),
      });

      const data = await res.json();

      if (res.ok) {
        setUpdateStatus({
          loading: false,
        });
        setBooking(data.booking);
      } else {
        setUpdateStatus({
          loading: false,
          message: `❌ Lỗi: ${data.message || "Cập nhật thất bại."}`,
        });
      }
    } catch (error) {
      setUpdateStatus({
        loading: false,
        message: "❌ Lỗi kết nối Server khi gửi yêu cầu.",
      });
    }
  };

  // Hàm xử lý khi chọn Thanh toán trực tiếp
  const handleCashPayment = () => {
    alert(
      "Bạn đã chọn Thanh toán trực tiếp (tiền mặt). Admin sẽ liên hệ bạn để sắp xếp việc thanh toán sau."
    );
  };

  // Trạng thái đơn hàng
  const isPending = booking && booking.trangThai === "Pending";
  const isConfirmed = booking && booking.trangThai === "Confirmed";
  const isCompleted = booking && booking.trangThai === "Completed";
  const isCancelled = booking && booking.trangThai === "Cancelled";

  const isPaid = isConfirmed || isCompleted;

  // Logic hiển thị banner
  let bannerMessage;
  let bannerColor;
  let bannerIcon;

  if (isPaid) {
    bannerMessage = "THANH TOÁN THÀNH CÔNG";
    bannerColor = "bg-green-100 border-green-400 text-green-700";
    bannerIcon = (
      <RiCheckDoubleFill className="w-12 h-12 text-green-600 mx-auto mb-3" />
    );
  } else if (isCancelled) {
    bannerMessage = "ĐƠN HÀNG ĐÃ BỊ HỦY";
    bannerColor = "bg-red-100 border-red-400 text-red-700";
    bannerIcon = (
      <RiCloseCircleFill className="w-12 h-12 text-red-600 mx-auto mb-3" />
    );
  } else {
    bannerMessage = "CHỜ THANH TOÁN";
    bannerColor = "bg-yellow-100 border-yellow-400 text-yellow-700";
    bannerIcon = (
      <RiCheckDoubleFill className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <RiLoader4Line className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-3 text-lg text-gray-700 font-semibold">
            Đang tải xác nhận đơn hàng...
          </span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-xl mx-auto mt-16 p-8 text-center bg-red-50 border border-red-300 rounded-xl shadow-lg">
          <RiErrorWarningLine className="w-8 h-8 inline mr-2 text-red-600" />
          <p className="text-red-600 font-semibold text-xl inline-block">
            {error || "Không tìm thấy đơn hàng này."}
          </p>
          <button
            onClick={() => navigate("/userinfo")}
            className="mt-4 block mx-auto text-blue-600 hover:text-blue-800 font-medium"
          >
            Quay lại Hồ sơ
          </button>
        </div>
      </div>
    );
  }

  const tenTour = booking.tenTour;
  const tongChiPhi = booking.tongChiPhi;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="container mx-auto max-w-4xl py-10 px-4">
        {/* THÔNG BÁO XÁC NHẬN CHUNG (Status Banner) */}
        <div
          className={`p-6 rounded-2xl shadow-xl mb-8 text-center border ${bannerColor}`}
        >
          {bannerIcon}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {bannerMessage}
          </h1>
          <p
            className={`text-lg font-medium ${
              isPaid
                ? "text-green-700"
                : isCancelled
                ? "text-red-700"
                : "text-yellow-700"
            }`}
          >
            Mã Booking:
            <span className="font-extrabold ml-1">
              #{bookingId.slice(-8).toUpperCase()}
            </span>
          </p>

          {/* Thông điệp chi tiết trạng thái */}
          {isPending && (
            <p className="text-sm text-yellow-700 mt-2">Đang chờ thanh toán</p>
          )}
          {isConfirmed && (
            <p className="text-sm text-green-700 mt-2">
              Đơn hàng đã được xác nhận
            </p>
          )}
          {isCancelled && (
            <p className="text-sm text-red-700 mt-2">Đơn hàng đã bị hủy</p>
          )}
        </div>

        {updateStatus && (
          <div
            className={`p-3 mb-4 rounded-xl font-medium text-sm border ${
              updateStatus.message.startsWith("✅")
                ? "bg-green-100 text-green-700 border-green-300"
                : "bg-red-100 text-red-700 border-red-300"
            }`}
          >
            {updateStatus.loading && (
              <RiLoader4Line className="animate-spin inline mr-2" />
            )}
            {updateStatus.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CỘT 1: CHI TIẾT ĐƠN HÀNG */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
              <RiFileList3Line className="w-6 h-6 text-indigo-500" /> Chi tiết
              đơn hàng
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              {/* --- KHỐI THÔNG TIN TOUR --- */}
              <div className="pb-3 border-b border-dashed space-y-2">
                <p className="font-medium text-gray-600">Tên Tour:</p>
                <span className="font-extrabold text-indigo-600 text-xl block">
                  {tenTour}
                </span>
              </div>

              {/* --- KHỐI THÔNG TIN KHÁCH HÀNG --- */}
              <h3 className="font-semibold text-gray-800 pt-3">
                Thông tin Khách hàng
              </h3>
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <RiUser3Line className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <p>
                    Khách hàng:{" "}
                    <span className="font-semibold">{booking.hoTenKhach}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <RiMailLine className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <p className="break-words">
                    Email:{" "}
                    <span className="font-semibold">{booking.emailKhach}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <RiPhoneLine className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  <p>
                    Điện thoại:{" "}
                    <span className="font-semibold">
                      {booking.dienThoaiKhach || "Không có"}
                    </span>
                  </p>
                </div>
              </div>

              {/* --- KHỐI CHI TIẾT ĐẶT TOUR --- */}
              <h3 className="font-semibold text-gray-800 pt-3 border-t">
                Chi tiết Đặt chỗ
              </h3>
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <RiCalendarCheckLine className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <p>
                    Ngày khởi hành:{" "}
                    <span className="font-semibold">
                      {formatDate(booking.ngayKhoiHanh)}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <RiTimeLine className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <p>
                    Số lượng khách:{" "}
                    <span className="font-semibold">
                      {booking.soLuongNguoi} người
                    </span>
                  </p>
                </div>
              </div>

              {/* Ghi chú */}
              <div className="pt-3 border-t">
                <p className="text-gray-600 font-medium">Ghi chú:</p>
                <p className="text-gray-500 italic mt-1 p-2 bg-gray-50 rounded-md">
                  {booking.ghiChu || "Không có ghi chú."}
                </p>
              </div>
            </div>

            {/* TỔNG CHI PHÍ */}
            <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-300">
              <p className="text-xl font-extrabold text-red-700 flex justify-between">
                <span>TỔNG CHI PHÍ: {formatCurrency(tongChiPhi)}</span>
              </p>
            </div>
          </div>

          {/* CỘT 2: PHƯƠNG THỨC THANH TOÁN */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 border-b pb-2 flex items-center gap-2">
              <RiMoneyEuroBoxLine className="w-6 h-6 text-red-600" /> Thanh toán
            </h2>

            {/* 1. MÃ QR (Chuyển khoản) */}
            <div
              className={`p-4 rounded-xl shadow-md border text-center ${
                isPaid || isCancelled
                  ? "bg-gray-100 opacity-70"
                  : "bg-white hover:bg-blue-50 transition"
              }`}
            >
              <h3
                className={`text-lg font-bold flex items-center justify-center gap-2 mb-3 ${
                  isPaid || isCancelled ? "text-gray-500" : "text-blue-600"
                }`}
              >
                <RiQrCodeLine /> 1. Thanh toán qua Mã QR (Chuyển khoản)
              </h3>

              {/* Chi tiết QR MOCK */}
              <img
                src={MOCK_QR_CODE}
                alt="QR Code"
                className="w-32 h-32 mx-auto border p-1"
              />
              <p className="text-sm mt-2 font-semibold">
                Số TK: {BANK_ACCOUNT}
              </p>
              <p className="text-xs text-gray-600">Chủ TK: {BANK_HOLDER}</p>
              <p className="text-xs text-red-500 font-semibold mt-1">
                Nội dung: {`BOOKING ${bookingId.slice(-8).toUpperCase()}`}
              </p>

              {/* Nút Xác nhận Thanh toán chỉ hiện khi CHƯA thanh toán và CHƯA hủy */}
              {!isPaid && !isCancelled && (
                <button
                  onClick={handleQrPayment}
                  className="mt-3 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex items-center justify-center mx-auto gap-2"
                >
                  {updateStatus && updateStatus.loading ? (
                    <>
                      <RiLoader4Line className="animate-spin w-4 h-4" /> Đang
                      xác nhận...
                    </>
                  ) : (
                    <>
                      <RiSendPlaneFill className="w-4 h-4" /> Xác nhận
                    </>
                  )}
                </button>
              )}
              {isPaid && (
                <div className="mt-3 text-green-700 font-bold text-sm">
                  Đã thanh toán!
                </div>
              )}
            </div>

            {/* 2. THANH TOÁN TRỰC TIẾP */}
            <div
              className={`p-4 rounded-xl shadow-md border ${
                isCancelled || isPaid
                  ? "bg-gray-100 opacity-70"
                  : "bg-white cursor-pointer hover:bg-gray-50 transition"
              }`}
              onClick={!isCancelled && !isPaid ? handleCashPayment : undefined}
            >
              <h3 className="text-lg font-bold text-green-600 flex items-center gap-2 mb-1">
                <RiBankCardLine /> 2. Thanh toán trực tiếp (Tiền mặt)
              </h3>
              <p className="text-sm text-gray-600">
                Admin sẽ liên hệ bạn để sắp xếp việc thanh toán sau.
              </p>
            </div>

            {/* Nút xem trạng thái */}
            <button
              onClick={() => navigate("/userinfo")}
              className="w-full py-3 mt-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md"
            >
              Xem tất cả đơn hàng của tôi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
