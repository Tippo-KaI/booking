// src/pages/admin/ManageHotels.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
// Import icons từ thư viện giả định
import {
  RiHotelLine,
  RiAddCircleLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiStarFill,
  RiMapPinLine,
  RiMoneyDollarBoxLine,
} from "react-icons/ri";

const API_HOTELS = "http://localhost:5000/api/admin/hotels";

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ===========================================================
  // 1. Fetch danh sách Khách sạn
  // ===========================================================
  const fetchHotels = async () => {
    try {
      const res = await fetch(API_HOTELS);
      const data = await res.json();

      if (res.ok) {
        setHotels(data.hotels || []);
      } else {
        setMessage(
          `❌ Lỗi tải dữ liệu: ${
            data.message || "Không thể tải danh sách khách sạn."
          }`
        );
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối Server khi tải Khách sạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // ===========================================================
  // 2. Xóa Khách sạn
  // ===========================================================
  const handleDelete = async (hotelId, hotelName) => {
    try {
      const res = await fetch(`${API_HOTELS}/${hotelId}`, { method: "DELETE" });

      if (res.ok) {
        setMessage(`✅ Đã xóa Khách sạn: "${hotelName}" thành công.`);
        fetchHotels();
      } else {
        const data = await res.json();
        setMessage(`❌ Lỗi xóa: ${data.message || "Lỗi server"}`);
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối khi xóa Khách sạn.");
    }
  };

  // ===========================================================
  // 3. Chuyển sang trang sửa
  // ===========================================================
  const handleEdit = (hotelId) => {
    navigate(`/admin/edit-hotel/${hotelId}`);
  };

  // Định dạng giá
  const formatPrice = (price) => {
    return price ? price.toLocaleString("vi-VN") + " VNĐ" : "---";
  };

  // ====================== LOADING UI =======================
  if (loading)
    return (
      <AdminLayout>
        <p className="text-blue-600 font-semibold text-lg flex items-center gap-2">
          <RiHotelLine className="animate-spin" /> Đang tải danh sách Khách
          sạn...
        </p>
      </AdminLayout>
    );

  // ====================== MAIN UI =======================
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <RiHotelLine className="text-orange-600 w-7 h-7" /> Quản Lý Khách sạn
          & Lưu trú
        </h2>

        {/* Nút thêm mới */}
        <button
          onClick={() => navigate("/admin/add-hotel")}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-green-500/30 transition transform hover:-translate-y-0.5"
        >
          <RiAddCircleLine className="w-5 h-5" /> Thêm Khách sạn Mới
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 shadow-md border 
            ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}
        >
          {message.startsWith("✅") || message.startsWith("❌")
            ? message
            : `ℹ️ ${message}`}
        </div>
      )}

      {/* Bảng danh sách */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tên Khách sạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Địa điểm
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Sao / Loại
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Giá thấp nhất
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {hotels.length > 0 ? (
              hotels.map((hotel) => (
                <tr
                  key={hotel._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                    {hotel.tenKhachSan}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <RiMapPinLine className="w-4 h-4 text-blue-400" />
                      {hotel.tinhThanh}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className="flex items-center">
                      <RiStarFill className="w-4 h-4 text-yellow-500 mr-1" />
                      {hotel.hangSao} ⭐ — {hotel.loaiHinh}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-green-700 font-semibold">
                    <span className="flex items-center gap-1">
                      <RiMoneyDollarBoxLine className="w-4 h-4" />
                      {formatPrice(hotel.giaThapNhat)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(hotel._id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition duration-150 mr-3 p-1.5 rounded-lg hover:bg-blue-50"
                      title="Chỉnh sửa khách sạn"
                    >
                      <RiPencilLine className="w-5 h-5 inline-block" />
                    </button>

                    <button
                      onClick={() => handleDelete(hotel._id, hotel.tenKhachSan)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm transition duration-150 p-1.5 rounded-lg hover:bg-red-50"
                      title="Xóa khách sạn"
                    >
                      <RiDeleteBinLine className="w-5 h-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-8 text-center text-gray-500 font-medium text-base"
                >
                  <RiHotelLine className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  Chưa có Khách sạn nào được đăng tải.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageHotels;
