// src/pages/admin/EditHotel.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
// Import icons
import {
  RiHotelLine,
  RiMapPinLine,
  RiStarFill,
  RiMoneyEuroBoxLine,
  RiLink,
  RiUploadCloudLine,
  RiQuillPenLine,
  RiPencilLine,
  RiLoader4Line,
  RiArrowGoBackLine,
} from "react-icons/ri";

const API_BASE = "http://localhost:5000/api/admin/hotels";
const API_UPLOAD = "http://localhost:5000/api/upload";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotelData, setHotelData] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [message, setMessage] = useState("");

  // 1. Fetch dữ liệu cũ
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        const data = await res.json();
        if (res.ok) {
          setHotelData(data.hotel);
        } else {
          setMessage(`❌ Không tìm thấy Khách sạn có ID: ${id}`);
        }
      } catch (error) {
        setMessage("❌ Lỗi kết nối Server khi tải chi tiết Khách sạn.");
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchHotelDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Đảm bảo giá và sao là số
    const newValue =
      name === "giaThapNhat" || name === "hangSao" ? Number(value) : value;
    setHotelData((prevData) => ({ ...prevData, [name]: newValue }));
    setMessage("");
  };

  // Hàm upload ảnh (giống AddHotel)
  const handleImageUpload = async (e) => {
    setMessage("Đang upload ảnh...");
    setLoadingUpload(true);

    try {
      const file = e.target.files[0];
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(API_UPLOAD, { method: "POST", body: fd });
      const data = await res.json();

      if (res.ok) {
        setHotelData((prevData) => ({ ...prevData, anhDaiDien: data.url }));
        setMessage("✅ Upload ảnh thành công! Nhấn Cập Nhật để lưu.");
      } else {
        setMessage("❌ Upload ảnh thất bại!");
      }
    } catch (err) {
      setMessage("❌ Lỗi upload ảnh!");
    } finally {
      setLoadingUpload(false);
      e.target.value = null; // Reset input file
    }
  };

  // 2. Submit dữ liệu chỉnh sửa
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hotelData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(
          `✅ Khách sạn "${hotelData.tenKhachSan}" đã được cập nhật thành công! Quay lại trang quản lý sau 2 giây.`
        );
        setTimeout(() => navigate("/admin/manage-hotels"), 2000);
      } else {
        setMessage(`❌ Lỗi cập nhật: ${data.message || "Lỗi server"}`);
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối đến Backend.");
    } finally {
      setLoadingUpdate(false);
    }
  };

  if (loadingFetch)
    return (
      <AdminLayout>
        <p className="text-blue-600 font-semibold text-lg flex items-center gap-2">
          <RiLoader4Line className="animate-spin" /> Đang tải thông tin Khách
          sạn...
        </p>
      </AdminLayout>
    );

  if (!hotelData)
    return (
      <AdminLayout>
        <p className="text-red-600 font-semibold text-lg">
          {message || "Không tìm thấy dữ liệu Khách sạn."}
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <RiPencilLine className="text-yellow-600 w-7 h-7" /> Sửa Khách sạn:{" "}
          {hotelData.tenKhachSan}
        </h2>
        <button
          onClick={() => navigate("/admin/manage-hotels")}
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
        {/* Tên Khách sạn */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiHotelLine /> Tên Khách sạn
          </label>
          <input
            type="text"
            name="tenKhachSan"
            value={hotelData.tenKhachSan}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
          />
        </div>

        {/* Địa điểm */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiMapPinLine /> Tỉnh/Thành phố
            </label>
            <input
              type="text"
              name="tinhThanh"
              value={hotelData.tinhThanh}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiMapPinLine /> Địa chỉ Chi tiết
            </label>
            <input
              type="text"
              name="diaChiChiTiet"
              value={hotelData.diaChiChiTiet}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
            />
          </div>
        </div>

        {/* Phân loại và Giá */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiStarFill /> Hạng sao (1-5)
            </label>
            <input
              type="number"
              name="hangSao"
              value={hotelData.hangSao}
              onChange={handleChange}
              required
              min="1"
              max="5"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiHotelLine /> Loại hình
            </label>
            <select
              name="loaiHinh"
              value={hotelData.loaiHinh}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition bg-white"
            >
              <option value="Khách sạn">Khách sạn</option>
              <option value="Resort">Resort</option>
              <option value="Homestay">Homestay</option>
              <option value="Villa">Villa</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiMoneyEuroBoxLine /> Giá thấp nhất (VNĐ)
            </label>
            <input
              type="number"
              name="giaThapNhat"
              value={hotelData.giaThapNhat}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
            />
          </div>
        </div>

        {/* Link Affiliate */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiLink /> Link đặt phòng
          </label>
          <input
            type="url"
            name="linkDatPhong"
            value={hotelData.linkDatPhong}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
          />
        </div>

        {/* Mô tả */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiQuillPenLine /> Mô tả khách sạn
          </label>
          <textarea
            rows="4"
            name="moTa"
            value={hotelData.moTa}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
          ></textarea>
        </div>

        {/* Upload Ảnh */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
            <RiUploadCloudLine /> Ảnh Đại Diện (Chọn ảnh mới để thay thế)
          </label>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Ảnh Hiện tại */}
            {hotelData.anhDaiDien && (
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500 mb-1">Ảnh Hiện Tại:</p>
                <img
                  src={hotelData.anhDaiDien}
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
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
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

        <button
          type="submit"
          disabled={loadingUpdate || loadingUpload}
          className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 shadow-md flex items-center justify-center gap-2
            ${
              loadingUpdate || loadingUpload
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/40"
            }`}
        >
          {loadingUpdate ? (
            <>
              <RiLoader4Line className="animate-spin" /> Đang Cập Nhật...
            </>
          ) : (
            "Cập Nhật Khách sạn"
          )}
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditHotel;
