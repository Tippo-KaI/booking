// src/pages/admin/AddEvent.jsx
import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
// Import icons
import {
  RiCalendarEventLine,
  RiUploadCloudLine,
  RiMapPinLine,
  RiQuillPenLine,
  RiTimeLine,
  RiLoader4Line,
} from "react-icons/ri";

const API_URL_CREATE = "http://localhost:5000/api/admin/events/create";
const API_URL_UPLOAD = "http://localhost:5000/api/upload";

const AddEvent = () => {
  const [formData, setFormData] = useState({
    tenSuKien: "",
    moTa: "",
    ngayBatDau: "",
    ngayKetThuc: "",
    tinhThanh: "",
    diaDiemCuThe: "",
    anhDaiDien: "",
  });

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage("");
  };

  // Upload ảnh
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingUpload(true);
    setMessage("");

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch(API_URL_UPLOAD, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({ ...prev, anhDaiDien: data.url }));
        setMessage("✅ Upload ảnh thành công!");
      } else {
        setMessage("❌ Upload ảnh thất bại!");
      }
    } catch {
      setMessage("❌ Lỗi upload ảnh!");
    } finally {
      setLoadingUpload(false);
      e.target.value = null; // Reset input file
    }
  };

  // Submit tạo sự kiện
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    setMessage("");

    if (!formData.anhDaiDien) {
      setLoadingCreate(false);
      return setMessage("❌ Vui lòng upload ảnh đại diện trước!");
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
          "✅ Đăng tải sự kiện thành công! Quay lại trang quản lý để xem."
        );
        // Reset form data
        setFormData({
          tenSuKien: "",
          moTa: "",
          ngayBatDau: "",
          ngayKetThuc: "",
          tinhThanh: "",
          diaDiemCuThe: "",
          anhDaiDien: "",
        });
      } else {
        setMessage(`❌ Lỗi: ${data.message || "Lỗi server"}`);
      }
    } catch {
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
            <RiCalendarEventLine className="text-purple-600 w-7 h-7" /> Đăng tải
            Sự kiện mới
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
            {/* Tên sự kiện */}
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                <RiQuillPenLine /> Tên Sự kiện / Lễ hội
              </label>
              <input
                type="text"
                name="tenSuKien"
                value={formData.tenSuKien}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                placeholder="Ví dụ: Lễ hội pháo hoa quốc tế Đà Nẵng"
                required
              />
            </div>

            {/* Ngày */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                  <RiTimeLine /> Ngày Bắt đầu
                </label>
                <input
                  type="date"
                  name="ngayBatDau"
                  value={formData.ngayBatDau}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                  <RiTimeLine /> Ngày Kết thúc
                </label>
                <input
                  type="date"
                  name="ngayKetThuc"
                  value={formData.ngayKetThuc}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                  required
                />
              </div>
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
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="Ví dụ: Quảng Ninh, TP.HCM"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                  <RiMapPinLine /> Địa điểm cụ thể
                </label>
                <input
                  type="text"
                  name="diaDiemCuThe"
                  value={formData.diaDiemCuThe}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                  placeholder="Ví dụ: Công viên Sun World, Sân vận động..."
                  required
                />
              </div>
            </div>

            {/* Upload ảnh & Preview */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex flex-col">
                <label className="text-sm text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
                  <RiUploadCloudLine /> Ảnh đại diện sự kiện
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
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

            {/* Mô tả */}
            <div className="flex flex-col pt-4 border-t border-gray-100">
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                <RiQuillPenLine /> Mô tả chi tiết sự kiện
              </label>
              <textarea
                rows="4"
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
                required
              ></textarea>
            </div>

            {/* Nút submit */}
            <button
              type="submit"
              disabled={loadingCreate || loadingUpload}
              className={`w-full py-3 rounded-xl text-white font-semibold transition shadow-md mt-6 flex items-center justify-center gap-2
                ${
                  loadingCreate || loadingUpload
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 shadow-purple-500/40"
                }`}
            >
              {loadingCreate ? (
                <>
                  <RiLoader4Line className="animate-spin" /> Đang tạo sự kiện...
                </>
              ) : (
                "Đăng tải Sự kiện"
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddEvent;
