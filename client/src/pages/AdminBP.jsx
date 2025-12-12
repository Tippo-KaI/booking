// src/pages/AdminBookingPage.jsx

import React, { useState, useEffect } from "react";
import {
  RiLoader4Line,
  RiAlertFill,
  RiFileList2Line,
  RiMoneyDollarCircleFill,
  RiAddCircleLine,
  RiUser3Line,
  RiMailLine,
  RiTimeFill,
  RiShoppingBag3Line,
  RiCalendar2Line,
  RiMoneyEuroBoxLine,
  RiCheckFill,
  RiCloseFill,
} from "react-icons/ri";
import AdminLayout from "../components/AdminLayout";

const API_BOOKINGS = "http://localhost:5000/api/bookings/admin/tours";

const AdminBP = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    // Sử dụng RiMoneyEuroBoxLine trong bảng, nên dùng VNĐ ở đây
    return amount ? amount.toLocaleString("vi-VN") + " VNĐ" : "—";
  };

  // Hàm định dạng ngày (chỉ ngày)
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("vi-VN") : "—";
  };

  // Hàm định dạng ngày giờ (cho Ngày tạo)
  const formatDateTime = (dateString) => {
    return dateString
      ? new Date(dateString).toLocaleTimeString("vi-VN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";
  };

  // Hàm styling cho trạng thái Booking (Đã được định nghĩa trong AdminBookingPage gốc)
  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  // Hàm lấy Icon trạng thái (Đã được định nghĩa trong AdminBookingPage gốc)
  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <RiCheckFill className="w-4 h-4 mr-1 text-green-600" />;

      case "Cancelled":
        return <RiCloseFill className="w-4 h-4 mr-1 text-red-600" />;

      case "Completed":
        return <RiCheckFill className="w-4 h-4 mr-1 text-blue-600" />;

      case "Pending":
      default:
        return <RiTimeFill className="w-4 h-4 mr-1 text-yellow-600" />;
    }
  };

  const fetchBookings = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập lại (Thiếu Token).");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_BOOKINGS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setBookings(data.bookings || []);
      } else if (res.status === 401 || res.status === 403) {
        setError("Lỗi xác thực. Token không hợp lệ hoặc bạn không có quyền.");
      } else {
        setError(data.message || `Lỗi tải danh sách Booking (${res.status}).`);
      }
    } catch (err) {
      setError("Lỗi kết nối Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Hết phiên làm việc.");

    try {
      const res = await fetch(`${API_BOOKINGS}/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trangThai: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchBookings(); // Tải lại danh sách sau khi cập nhật
      } else {
        alert(`Lỗi cập nhật: ${data.message}`);
      }
    } catch (err) {
      alert("Lỗi kết nối khi cập nhật trạng thái.");
    }
  };

  return (
    <AdminLayout>
      {/* TIÊU ĐỀ CHÍNH */}
      <h1 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-3 border-b-2 border-gray-200 pb-2">
        <RiFileList2Line className="w-7 h-7 text-blue-600" /> Quản lý Đặt Tour
      </h1>

      {/* BẢNG BOOKING */}
      {!loading && !error && (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Mã Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Tour & Khởi hành
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SL | Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500 font-medium"
                  >
                    <RiFileList2Line className="w-8 h-8 mx-auto mb-3" />
                    Chưa có đơn đặt tour nào.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition">
                    {/* Mã Booking */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <p className="font-semibold text-slate-800">
                        {/* Sửa lỗi: đảm bảo _id tồn tại trước khi dùng slice */}
                        {booking._id
                          ? `#${booking._id.slice(-6).toUpperCase()}`
                          : "N/A"}
                      </p>
                    </td>

                    {/* Tour & Khởi hành */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-semibold text-gray-800">
                        {booking.tenTour || "N/A"}
                      </p>
                      <p className="text-sm text-blue-600 flex items-center gap-1">
                        <RiCalendar2Line className="w-3 h-3" /> Ngày đi:{" "}
                        {formatDate(booking.ngayKhoiHanh)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Thời lượng: {booking.thoiGianTour || "Chưa rõ"}
                      </p>
                    </td>

                    {/* Khách hàng */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800 flex items-center gap-1">
                        <RiUser3Line className="w-3 h-3 text-gray-500" />{" "}
                        {booking.hoTenKhach || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <RiMailLine className="w-3 h-3" />{" "}
                        {booking.emailKhach || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500">
                        SĐT: {booking.dienThoaiKhach || "Không có"}
                      </p>
                    </td>

                    {/* SL | Tổng tiền */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-700">
                        SL: {booking.soLuongNguoi || 1} người
                      </p>
                      <p className="text-red-600 font-bold flex items-center gap-1 mt-1">
                        {formatCurrency(booking.tongChiPhi)}
                      </p>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border items-center ${getStatusStyle(
                          booking.trangThai
                        )}`}
                      >
                        {getStatusIcon(booking.trangThai)} {booking.trangThai}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <select
                        value={booking.trangThai}
                        onChange={(e) =>
                          handleStatusChange(booking._id, e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-xl text-sm bg-white cursor-pointer shadow-sm hover:border-indigo-500 transition"
                      >
                        <option value="Pending">Chờ xử lý</option>
                        <option value="Confirmed">Xác nhận</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Cancelled">Hủy bỏ</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBP;
