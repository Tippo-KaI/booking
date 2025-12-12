// src/pages/admin/EditEvent.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout"; // Layout Admin
// Import icons
import {
  RiCalendarEventLine,
  RiPencilLine,
  RiTimeLine,
  RiMapPinLine,
  RiUploadCloudLine,
  RiQuillPenLine,
  RiLoader4Line,
  RiArrowGoBackLine,
} from "react-icons/ri";

// Định nghĩa các URL API
const API_BASE = "http://localhost:5000/api/admin/events"; // GET /:id, PUT /:id
const API_UPLOAD = "http://localhost:5000/api/upload"; // Endpoint Upload Ảnh

// Khởi tạo state ban đầu với cấu trúc đầy đủ
const initialEventData = {
  tenSuKien: "",
  moTa: "",
  ngayBatDau: "",
  ngayKetThuc: "",
  tinhThanh: "",
  diaDiemCuThe: "",
  anhDaiDien: "",
};

const EditEvent = () => {
  const { id } = useParams(); // Lấy ID Sự kiện từ URL
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(initialEventData);
  const [loadingFetch, setLoadingFetch] = useState(true); // Trạng thái tải dữ liệu cũ
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Trạng thái cập nhật
  const [loadingUpload, setLoadingUpload] = useState(false); // Trạng thái upload ảnh
  const [message, setMessage] = useState(""); // 1. Fetch dữ liệu Sự kiện hiện tại khi component tải

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`); // Gọi API READ ONE
        const data = await res.json();
        if (res.ok) {
          // Chỉnh sửa format ngày để hiển thị đúng trong input type="date"
          const event = data.event;
          setEventData({
            ...event,
            // Chuyển đổi Date object sang chuỗi YYYY-MM-DD
            ngayBatDau: event.ngayBatDau ? event.ngayBatDau.split("T")[0] : "",
            ngayKetThuc: event.ngayKetThuc
              ? event.ngayKetThuc.split("T")[0]
              : "",
          });
        } else {
          setMessage(`❌ Không tìm thấy Sự kiện có ID: ${id}`);
        }
      } catch (error) {
        setMessage("❌ Lỗi kết nối Server khi tải chi tiết Sự kiện.");
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({ ...prevData, [name]: value }));
    setMessage("");
  }; // Xử lý upload ảnh

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingUpload(true);
    setMessage("");
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch(API_UPLOAD, { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok) {
        setEventData((prevData) => ({ ...prevData, anhDaiDien: data.url }));
        setMessage("✅ Upload ảnh thành công! Vui lòng nhấn Cập Nhật để lưu.");
      } else {
        setMessage("❌ Upload ảnh thất bại!");
      }
    } catch (err) {
      setMessage("❌ Lỗi upload ảnh!");
    } finally {
      setLoadingUpload(false);
      e.target.value = null; // Reset input file
    }
  }; // 2. Submit dữ liệu chỉnh sửa (PUT request)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(
          `✅ Sự kiện "${eventData.tenSuKien}" đã được cập nhật thành công! Quay lại trang quản lý sau 2 giây.`
        ); // Quay lại trang quản lý sau 2 giây
        setTimeout(() => navigate("/admin/manage-events"), 2000);
      } else {
        setMessage(`❌ Lỗi cập nhật Sự kiện: ${data.message || "Lỗi server"}`);
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối đến Backend.");
    } finally {
      setLoadingUpdate(false);
    }
  }; // Hiển thị Loading/Error khi Fetch dữ liệu

  if (loadingFetch)
    return (
      <AdminLayout>
        <p className="text-blue-600 font-semibold text-lg flex items-center gap-2">
          <RiLoader4Line className="animate-spin" /> Đang tải thông tin Sự kiện
          cũ...
        </p>
      </AdminLayout>
    );

  if (!eventData.tenSuKien)
    return (
      <AdminLayout>
        <p className="text-red-600 font-semibold text-lg">
          {message || "Không tìm thấy dữ liệu Sự kiện để sửa."}
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <RiPencilLine className="text-purple-600 w-7 h-7" /> Chỉnh sửa:{" "}
          {eventData.tenSuKien}
        </h2>
        <button
          onClick={() => navigate("/admin/manage-events")}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5"
        >
          <RiArrowGoBackLine className="w-5 h-5" /> Quay lại
        </button>
      </div>

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

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6 max-w-4xl"
      >
        {/* Tên Sự kiện */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiCalendarEventLine /> Tên Sự kiện / Lễ hội
          </label>
          <input
            type="text"
            name="tenSuKien"
            value={eventData.tenSuKien}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
        </div>

        {/* Ngày Bắt đầu và Ngày Kết thúc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiTimeLine /> Ngày Bắt đầu
            </label>
            <input
              type="date"
              name="ngayBatDau"
              value={eventData.ngayBatDau}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiTimeLine /> Ngày Kết thúc
            </label>
            <input
              type="date"
              name="ngayKetThuc"
              value={eventData.ngayKetThuc}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>
        </div>

        {/* Tỉnh thành và Địa điểm cụ thể */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiMapPinLine /> Tỉnh/Thành phố
            </label>
            <input
              type="text"
              name="tinhThanh"
              value={eventData.tinhThanh}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiMapPinLine /> Địa điểm Cụ thể
            </label>
            <input
              type="text"
              name="diaDiemCuThe"
              value={eventData.diaDiemCuThe}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            />
          </div>
        </div>

        {/* Upload ảnh và Preview */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
            <RiUploadCloudLine /> Ảnh Đại Diện (Chọn ảnh mới để thay thế)
          </label>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Ảnh Hiện tại */}
            {eventData.anhDaiDien && (
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500 mb-1">Ảnh Hiện Tại:</p>
                <img
                  src={eventData.anhDaiDien}
                  alt="Ảnh hiện tại"
                  className="w-32 h-32 object-cover rounded-xl shadow-md border border-gray-200"
                />
              </div>
            )}

            {/* Input File */}
            <div className="flex-1 w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />

              {loadingUpload && (
                <p className="text-blue-500 mt-2 flex items-center gap-2">
                  <RiLoader4Line className="animate-spin" /> Đang upload ảnh
                  mới...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Mô tả */}
        <div className="mb-6 pt-4 border-t border-gray-100">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiQuillPenLine /> Mô tả chi tiết sự kiện
          </label>
          <textarea
            rows="4"
            name="moTa"
            value={eventData.moTa}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loadingUpdate || loadingUpload}
          className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 shadow-md flex items-center justify-center gap-2
            ${
              loadingUpdate || loadingUpload
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/40"
            }`}
        >
          {loadingUpdate ? (
            <>
              <RiLoader4Line className="animate-spin" /> Đang Cập Nhật...
            </>
          ) : (
            "Cập Nhật Sự kiện"
          )}
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditEvent;
