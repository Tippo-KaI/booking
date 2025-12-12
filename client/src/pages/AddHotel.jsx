// src/pages/admin/AddHotel.jsx
import React, { useState } from "react";
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
  RiLoader4Line,
} from "react-icons/ri";

const API_URL_CREATE = "http://localhost:5000/api/admin/hotels/create";
const API_URL_UPLOAD = "http://localhost:5000/api/upload";

// Khởi tạo state với cấu trúc đầy đủ của Hotel Model
const initialHotelData = {
  tenKhachSan: "",
  moTa: "",
  tinhThanh: "",
  diaChiChiTiet: "",
  hangSao: 3, // Mặc định 3 sao
  loaiHinh: "Khách sạn", // Mặc định
  giaThapNhat: 0,
  linkDatPhong: "",
  anhDaiDien: "",
};

const AddHotel = () => {
  const [formData, setFormData] = useState(initialHotelData);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Chuyển giá và sao sang số nếu cần
    const newValue =
      name === "giaThapNhat" || name === "hangSao" ? Number(value) : value;
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    setMessage("");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingUpload(true);
    setMessage("");
    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch(API_URL_UPLOAD, { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setFormData((prevData) => ({ ...prevData, anhDaiDien: data.url }));
        setMessage("✅ Upload ảnh thành công!");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    setMessage("");

    if (!formData.anhDaiDien || !formData.linkDatPhong) {
      setLoadingCreate(false);
      return setMessage("❌ Vui lòng upload ảnh và điền link đặt phòng!");
    }

    try {
      const res = await fetch(API_URL_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(
          "✅ Đăng tải Khách sạn thành công! Quay lại trang quản lý để xem."
        );
        setFormData(initialHotelData); // Reset form
      } else {
        setMessage(`❌ Lỗi: ${data.message || "Lỗi server không xác định."}`);
      }
    } catch (error) {
      setMessage("❌ Không thể kết nối server!");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full flex justify-center">
        <div className="max-w-4xl w-full">
          <h2 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-3">
            <RiHotelLine className="text-yellow-600 w-7 h-7" /> Đăng tải Khách
            sạn mới
          </h2>

          {message && (
            <div
              className={`p-3 mb-6 rounded-xl font-medium text-center shadow-md border 
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
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6"
          >
            {/* Tên Khách sạn */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                <RiHotelLine /> Tên Khách sạn/Cơ sở lưu trú
              </label>
              <input
                type="text"
                name="tenKhachSan"
                value={formData.tenKhachSan}
                onChange={handleChange}
                required
                placeholder="Ví dụ: InterContinental Danang"
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
                  value={formData.tinhThanh}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Đà Nẵng, Phú Quốc"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                  <RiMapPinLine /> Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  name="diaChiChiTiet"
                  value={formData.diaChiChiTiet}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Bãi Bắc, Sơn Trà"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                />
              </div>
            </div>

            {/* Hạng sao - loại hình - giá */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                  <RiStarFill /> Hạng sao (1–5)
                </label>
                <input
                  type="number"
                  name="hangSao"
                  value={formData.hangSao}
                  onChange={handleChange}
                  min="1"
                  max="5"
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                  <RiHotelLine /> Loại hình
                </label>
                <select
                  name="loaiHinh"
                  value={formData.loaiHinh}
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
                  value={formData.giaThapNhat}
                  onChange={handleChange}
                  min="0"
                  required
                  placeholder="Ví dụ: 2500000"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                />
              </div>
            </div>

            {/* Link Affiliate */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                <RiLink /> Link đặt phòng (affiliate)
              </label>
              <input
                type="url"
                name="linkDatPhong"
                value={formData.linkDatPhong}
                onChange={handleChange}
                required
                placeholder="https://booking.com/affiliate-link"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
              />
            </div>

            {/* Mô tả */}
            <div className="flex flex-col pt-4 border-t border-gray-100">
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                <RiQuillPenLine /> Mô tả khách sạn / tiện nghi
              </label>
              <textarea
                rows="4"
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none transition"
                placeholder="Mô tả các tiện nghi, dịch vụ nổi bật..."
              ></textarea>
            </div>

            {/* Upload ảnh & Preview */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
                  <RiUploadCloudLine /> Ảnh đại diện (Thumbnail)
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                />

                {loadingUpload && (
                  <p className="text-blue-500 mt-2 flex items-center gap-2">
                    <RiLoader4Line className="animate-spin" /> Đang upload
                    ảnh...
                  </p>
                )}

                {formData.anhDaiDien && (
                  <div className="mt-4 flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Ảnh đã tải lên:
                    </p>
                    <img
                      src={formData.anhDaiDien}
                      alt="Ảnh đại diện"
                      className="w-64 h-auto rounded-xl shadow-lg border border-gray-200 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Nút submit */}
            <button
              type="submit"
              disabled={loadingCreate || loadingUpload}
              className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-md mt-6 flex items-center justify-center gap-2
                ${
                  loadingCreate || loadingUpload
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 hover:bg-yellow-700 shadow-yellow-500/40"
                }`}
            >
              {loadingCreate ? (
                <>
                  <RiLoader4Line className="animate-spin" /> Đang tạo...
                </>
              ) : (
                "Đăng tải Khách sạn"
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddHotel;
