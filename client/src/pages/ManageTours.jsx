// src/pages/admin/ManageTours.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
// Import icons từ thư viện giả định
import {
  RiPlaneLine,
  RiAddCircleLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiMoneyEuroBoxLine,
  RiTicketLine,
  RiTimeLine,
  RiLoader4Line, // Thêm icon Loader
} from "react-icons/ri";

const API_TOURS = "http://localhost:5000/api/tours"; // Đã sửa thành /api/tours chung

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 💡 HÀM ĐỊNH DẠNG TIỀN TỆ
  const formatCurrency = (amount) => {
    return amount ? amount.toLocaleString("vi-VN") + "" : "—";
  };

  const fetchTours = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(API_TOURS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) setTours(data.tours || []);
      else setMessage(`❌ ${data.message || "Không thể tải dữ liệu"}`);
    } catch (err) {
      setMessage("❌ Lỗi kết nối Server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleDelete = async (tourId, tourName) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_TOURS}/${tourId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Đã xóa Tour: "${tourName}" thành công.`);
        fetchTours();
      } else {
        setMessage(`❌ ${data.message || "Lỗi xóa tour"}`);
      }
    } catch {
      setMessage("❌ Lỗi kết nối Server khi xóa");
    }
  };

  const handleEdit = (id) => navigate(`/admin/edit-tour/${id}`);
  if (loading)
    return (
      <AdminLayout>
        <p className="text-blue-600 font-semibold text-lg flex items-center gap-2">
          <RiLoader4Line className="animate-spin w-6 h-6" /> Đang tải danh sách
          Tour...
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <RiPlaneLine className="text-blue-600 w-7 h-7" /> Quản Lý Tours Du
          Lịch
        </h2>
        {/* Nút thêm mới */}
        <button
          onClick={() => navigate("/admin/add-tour")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition transform hover:-translate-y-0.5"
        >
          <RiAddCircleLine className="w-5 h-5" /> Thêm Tour Mới
        </button>
      </div>

      {/* MESSAGE ALERT */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 shadow-md border 
            ${
              message.startsWith("✅")
                ? "bg-green-50 text-green-700 border-green-300"
                : "bg-red-50 text-red-700 border-red-300"
            }`}
        >
          {message}
        </div>
      )}

      {/* TABLE WRAPPER */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          {/* TABLE HEAD */}
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tên Tour
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Giá Cơ bản
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thời lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Loại hình
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody className="bg-white divide-y divide-gray-100">
            {tours.length > 0 ? (
              tours.map((tour) => (
                <tr
                  key={tour._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {tour.tenTour}
                  </td>

                  {/* CỘT GIÁ CƠ BẢN */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <RiMoneyEuroBoxLine className="w-4 h-4" />
                      {formatCurrency(tour.giaCoBan)}
                    </span>
                  </td>

                  {/* CỘT THỜI LƯỢNG */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                      <RiTimeLine className="w-4 h-4" />
                      {tour.thoiGian || "—"}
                    </span>
                  </td>

                  {/* CỘT LOẠI HÌNH */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                      <RiTicketLine className="w-4 h-4" />
                      {tour.loaiHinh || "—"}
                    </span>
                  </td>

                  {/* CỘT THAO TÁC */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(tour._id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition duration-150 mr-3 p-1.5 rounded-lg hover:bg-blue-50"
                      title="Chỉnh sửa tour"
                    >
                      <RiPencilLine className="w-5 h-5 inline-block" />
                    </button>
                    <button
                      onClick={() => handleDelete(tour._id, tour.tenTour)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm transition duration-150 p-1.5 rounded-lg hover:bg-red-50"
                      title="Xóa tour"
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
                  <RiPlaneLine className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  Chưa có Tour nào được đăng tải.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageTours;
