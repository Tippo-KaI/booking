import React, { useState, useEffect } from "react";
import Header from "../components/Header";
// Import icons
import {
  RiCalendarEventLine,
  RiMapPinLine,
  RiTimeLine,
  RiLoader4Line,
  RiCloseCircleLine,
} from "react-icons/ri";

const API_URL_READ = "http://localhost:5000/api/admin/events";

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    // Định dạng ngày tháng đẹp hơn (ví dụ: Ngày 12 tháng 9 năm 2025)
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Hàm gọi API lấy danh sách Sự kiện
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL_READ);
      const data = await res.json();

      if (res.ok) {
        setEvents(data.events || []);
      } else {
        setError(data.message || "Không thể tải dữ liệu sự kiện.");
        setEvents([]);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Lỗi kết nối server.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi component được mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // ===========================================================
  // RENDER NỘI DUNG ĐỘNG
  // ===========================================================
  let content;

  if (loading) {
    content = (
      <div className="text-center py-20 text-blue-600 font-semibold flex items-center justify-center gap-2">
        <RiLoader4Line className="animate-spin w-5 h-5" /> Đang tải danh sách Sự
        kiện...
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-20 p-4 bg-red-50 text-red-600 font-medium rounded-xl shadow-sm border border-red-300 flex items-center justify-center gap-2">
        <RiCloseCircleLine className="w-6 h-6" /> Lỗi tải dữ liệu: {error}
      </div>
    );
  } else if (events.length === 0) {
    content = (
      <div className="text-center py-20 text-gray-500 text-lg">
        <RiCalendarEventLine className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        Hiện tại không có sự kiện nào sắp diễn ra.
      </div>
    );
  } else {
    content = (
      // GRID CARD 3 CỘT
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            // Không có link đặt phòng, nên chỉ làm cho khối card nổi bật khi hover
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            {/* Ảnh đại diện */}
            <img
              src={
                event.anhDaiDien ||
                "https://via.placeholder.com/400x200?text=Event+Image"
              }
              alt={event.tenSuKien}
              className="w-full h-52 object-cover"
            />

            <div className="p-5">
              {/* Tiêu đề */}
              <h3 className="font-extrabold text-xl text-slate-800 line-clamp-2 mb-2 leading-snug">
                {event.tenSuKien}
              </h3>

              {/* Ngày tháng */}
              <p className="text-sm text-purple-600 font-semibold mb-3 flex items-center gap-1">
                <RiTimeLine className="w-4 h-4" />
                {formatDate(event.ngayBatDau)} - {formatDate(event.ngayKetThuc)}
              </p>

              {/* Khu vực */}
              <div className="text-sm bg-gray-100 p-3 rounded-lg border border-gray-200 mb-4">
                <p className="font-medium text-gray-700 flex items-center gap-2">
                  <RiMapPinLine className="w-4 h-4 text-purple-500" />
                  {event.tinhThanh}
                </p>
                <p className="text-xs text-gray-500 mt-1 pl-6">
                  {event.diaDiemCuThe}
                </p>
              </div>

              {/* Mô tả ngắn gọn */}
              <p className="text-gray-700 text-sm italic line-clamp-3">
                {event.moTa}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 md:px-8 py-10">
        <h1 className="text-4xl font-extrabold mb-8 text-gray-800 flex items-center gap-3 border-b pb-2">
          <RiCalendarEventLine className="w-8 h-8 text-purple-600" /> Sự Kiện &
          Lễ Hội Sắp Diễn Ra
        </h1>
        {content}
      </main>
    </div>
  );
};

export default EventPage;
