import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
// Import icons từ thư viện giả định (ví dụ: RiPencilLine, RiDeleteBinLine, v.v.)
import {
  RiCalendarEventLine,
  RiAddCircleLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiMapPinLine,
  RiTimeLine,
} from "react-icons/ri";

const API_EVENTS = "http://localhost:5000/api/admin/events";

const ManageEvent = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const res = await fetch(API_EVENTS);
      const data = await res.json();

      if (res.ok) {
        setEvents(data.events || []);
      } else {
        setMessage(
          `❌ Lỗi tải dữ liệu: ${
            data.message || "Không thể tải danh sách Sự kiện."
          }`
        );
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối Server khi tải Sự kiện.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId, eventName) => {
    try {
      const res = await fetch(`${API_EVENTS}/${eventId}`, { method: "DELETE" });
      if (res.ok) {
        setMessage(`✅ Đã xóa Sự kiện: "${eventName}" thành công.`);
        fetchEvents();
      } else {
        const data = await res.json();
        setMessage(`❌ Lỗi xóa Sự kiện: ${data.message || "Lỗi server"}`);
      }
    } catch {
      setMessage("❌ Lỗi kết nối khi xóa Sự kiện.");
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/admin/edit-event/${eventId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    // Sử dụng tùy chọn múi giờ để đảm bảo hiển thị đúng ngày
    return new Date(dateString).toLocaleDateString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
  };

  if (loading)
    return (
      <AdminLayout>
        {/* Skeleton Loader hoặc Spinner */}
        <p className="text-blue-600 font-semibold text-lg flex items-center gap-2">
          <RiCalendarEventLine className="animate-spin" /> Đang tải danh sách Sự
          kiện...
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <RiCalendarEventLine className="text-purple-600 w-7 h-7" /> Quản Lý Sự
          kiện & Lễ hội
        </h2>

        {/* Nút thêm mới */}
        <button
          onClick={() => navigate("/admin/add-event")}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-purple-500/30 transition transform hover:-translate-y-0.5"
        >
          <RiAddCircleLine className="w-5 h-5" /> Thêm Sự kiện Mới
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
          {message}
        </div>
      )}

      {/* Bảng danh sách */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tên Sự kiện
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Địa điểm
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Ngày Bắt đầu
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {events.length > 0 ? (
              events.map((event) => (
                <tr
                  key={event._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                    {event.tenSuKien}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <RiMapPinLine className="w-4 h-4 text-purple-400" />
                      {event.tinhThanh} — {event.diaDiemCuThe}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-purple-600 font-medium">
                    <span className="flex items-center gap-1">
                      <RiTimeLine className="w-4 h-4" />
                      {formatDate(event.ngayBatDau)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(event._id)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-sm transition duration-150 mr-3 p-1.5 rounded-lg hover:bg-blue-50"
                      title="Chỉnh sửa sự kiện"
                    >
                      <RiPencilLine className="w-5 h-5 inline-block" />
                    </button>

                    <button
                      onClick={() => handleDelete(event._id, event.tenSuKien)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm transition duration-150 p-1.5 rounded-lg hover:bg-red-50"
                      title="Xóa sự kiện"
                    >
                      <RiDeleteBinLine className="w-5 h-5 inline-block" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-8 text-center text-gray-500 font-medium text-base"
                >
                  <RiCalendarEventLine className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  Chưa có Sự kiện nào được đăng tải.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageEvent;
