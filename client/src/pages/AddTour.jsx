// src/pages/admin/AddTour.jsx
import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout"; // Sửa đường dẫn nếu cần
// Import icons
import {
  RiPlaneLine,
  RiMapPinLine,
  RiQuillPenLine,
  RiUploadCloudLine,
  RiMoneyEuroBoxLine,
  RiTicketLine,
  RiTimeLine, // 👈 ICON MỚI CHO THỜI LƯỢNG
  RiLoader4Line,
} from "react-icons/ri";

// API URL (Đã thống nhất dùng /api/tours/create)
const API_URL_CREATE = "http://localhost:5000/api/tours/create";
const API_URL_UPLOAD = "http://localhost:5000/api/upload"; // Giữ nguyên

// Khởi tạo state với cấu trúc mới của Tour Model
const initialTourData = {
  tenTour: "",
  diaDiem: "",
  moTa: "", // 💡 TRƯỜNG MỚI
  giaCoBan: 0, // Giá cơ bản (Number)
  thoiGian: "", // Thời lượng (String, ví dụ: 3 ngày 2 đêm) // 💡 TRƯỜNG CŨ BỎ: linkAffiliate, nganSach
  anhDaiDien: "",
  loaiHinh: "Biển",
};

// Loại hình tour đã định nghĩa trong Model
const LOAI_HINH_TOURS = ["Biển", "Núi", "Văn hóa", "Nghỉ dưỡng", "Phiêu lưu"];

const AddTour = () => {
  const [formData, setFormData] = useState(initialTourData);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Xử lý riêng trường giaCoBan (chuyển sang số)
    if (name === "giaCoBan") {
      setFormData((prevData) => ({ ...prevData, [name]: Number(value) }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
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
      const res = await fetch(API_URL_UPLOAD, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({ ...prev, anhDaiDien: data.url }));
        setMessage("✅ Upload ảnh thành công!");
      } else {
        setMessage(`❌ Upload ảnh thất bại! (${data.message || ""})`);
      }
    } catch (err) {
      setMessage("❌ Lỗi kết nối server khi upload ảnh!");
    } finally {
      setLoadingUpload(false);
      e.target.value = null; // Reset input file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingCreate(true);
    setMessage("");

    if (!formData.anhDaiDien) {
      setLoadingCreate(false);
      return setMessage("❌ Vui lòng upload ảnh đại diện trước!");
    }
    // Thêm kiểm tra tối thiểu cho các trường số/cố định
    if (!formData.giaCoBan || formData.giaCoBan <= 0) {
      setLoadingCreate(false);
      return setMessage("❌ Vui lòng nhập Giá Cơ bản hợp lệ!");
    }
    if (!formData.thoiGian) {
      setLoadingCreate(false);
      return setMessage("❌ Vui lòng nhập Thời lượng Tour!");
    }

    // Lấy Token (Giả sử Admin đã đăng nhập)
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingCreate(false);
      return setMessage("❌ Lỗi xác thực: Vui lòng đăng nhập lại!");
    }

    try {
      const res = await fetch(API_URL_CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm token
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          "✅ Đăng tải Tour thành công! Quay lại trang quản lý để xem."
        );
        setFormData(initialTourData); // Reset form
      } else {
        setMessage(`❌ ${data.message || "Có lỗi xảy ra"}`);
      }
    } catch (error) {
      setMessage("❌ Không thể kết nối server!");
    } finally {
      setLoadingCreate(false);
    }
  };

  return (
    <AdminLayout>
           {" "}
      <div className="w-full flex justify-center">
               {" "}
        <div className="max-w-4xl w-full">
                   {" "}
          <h2 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-3">
                        <RiPlaneLine className="text-blue-600 w-7 h-7" /> Đăng
            tải Tour mới          {" "}
          </h2>
                   {" "}
          {message && (
            <div
              className={`p-3 mb-6 rounded-xl font-medium text-center shadow-md border 
                ${
                message.startsWith("✅")
                  ? "bg-green-50 text-green-700 border-green-300"
                  : "bg-red-50 text-red-700 border-red-300"
              }`}
            >
                            {message}           {" "}
            </div>
          )}
                   {" "}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6"
          >
                        {/* Tên Tour */}           {" "}
            <div className="flex flex-col">
                           {" "}
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                                <RiTicketLine /> Tên Tour              {" "}
              </label>
                           {" "}
              <input
                type="text"
                name="tenTour"
                value={formData.tenTour}
                onChange={handleChange}
                placeholder="Ví dụ: Khám phá Vịnh Hạ Long"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
                         {" "}
            </div>
                        {/* Địa điểm */}           {" "}
            <div className="flex flex-col">
                           {" "}
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                                <RiMapPinLine /> Địa điểm chính              {" "}
              </label>
                           {" "}
              <input
                type="text"
                name="diaDiem"
                value={formData.diaDiem}
                onChange={handleChange}
                placeholder="Ví dụ: Hạ Long, Sapa"
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              />
                         {" "}
            </div>
                        {/* 💡 GIÁ CƠ BẢN VÀ THỜI LƯỢNG */}           {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {" "}
              <div className="flex flex-col">
                               {" "}
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                                    <RiMoneyEuroBoxLine /> Giá Cơ Bản
                  (VNĐ/người)                {" "}
                </label>
                               {" "}
                <input
                  type="number"
                  name="giaCoBan"
                  value={formData.giaCoBan === 0 ? "" : formData.giaCoBan}
                  onChange={handleChange}
                  placeholder="Ví dụ: 2500000"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                  min="0"
                />
                             {" "}
              </div>
                           {" "}
              <div className="flex flex-col">
                               {" "}
                <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                                    <RiTimeLine /> Thời lượng (Ngày/Đêm)        
                         {" "}
                </label>
                               {" "}
                <input
                  type="text"
                  name="thoiGian"
                  value={formData.thoiGian}
                  onChange={handleChange}
                  placeholder="Ví dụ: 3 ngày 2 đêm"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                  required
                />
                             {" "}
              </div>
                         {" "}
            </div>
                       {/* 💡 LOẠI HÌNH (Giữ nguyên) */}           {" "}
            <div className="flex flex-col">
                             {" "}
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                                  <RiTicketLine /> Loại hình                {" "}
              </label>
                             {" "}
              <select
                name="loaiHinh"
                value={formData.loaiHinh}
                onChange={handleChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              >
                                 {" "}
                {LOAI_HINH_TOURS.map((loai) => (
                  <option key={loai} value={loai}>
                    {loai}
                  </option>
                ))}
                               {" "}
              </select>
                         {" "}
            </div>
                        {/* Upload ảnh & Preview */}           {" "}
            <div className="pt-4 border-t border-gray-100">
                           {" "}
              <div className="flex flex-col">
                               {" "}
                <label className="text-sm text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
                                    <RiUploadCloudLine /> Ảnh đại diện Tour    
                             {" "}
                </label>
                               {" "}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                               {" "}
                {loadingUpload && (
                  <p className="text-blue-500 mt-2 flex items-center gap-2">
                                       {" "}
                    <RiLoader4Line className="animate-spin" /> Đang upload
                    ảnh...                  {" "}
                  </p>
                )}
                               {" "}
                {formData.anhDaiDien && (
                  <div className="mt-4 flex flex-col items-center">
                                       {" "}
                    <p className="text-sm text-gray-500 mb-2">
                                            Ảnh đã tải lên:                    {" "}
                    </p>
                                       {" "}
                    <img
                      src={formData.anhDaiDien}
                      alt="Ảnh đại diện"
                      className="w-64 h-auto rounded-xl shadow-lg border border-gray-200 object-cover"
                    />
                                     {" "}
                  </div>
                )}
                             {" "}
              </div>
                         {" "}
            </div>
                        {/* Mô tả */}           {" "}
            <div className="flex flex-col pt-4 border-t border-gray-100">
                           {" "}
              <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
                                <RiQuillPenLine /> Mô tả chi tiết Tour          
                   {" "}
              </label>
                           {" "}
              <textarea
                rows="4"
                name="moTa"
                value={formData.moTa}
                onChange={handleChange}
                placeholder="Viết mô tả chi tiết về Tour, lịch trình, hoạt động..."
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                required
              ></textarea>
                         {" "}
            </div>
                       {" "}
            <button
              type="submit"
              className={`w-full text-white py-3 rounded-xl font-semibold transition shadow-md mt-6 flex items-center justify-center gap-2
                ${
                loadingCreate || loadingUpload
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/40"
              }`}
              disabled={loadingCreate || loadingUpload}
            >
                           {" "}
              {loadingCreate ? (
                <>
                                    <RiLoader4Line className="animate-spin" />{" "}
                  Đang tạo tour...                {" "}
                </>
              ) : (
                "Đăng tải Tour"
              )}
                         {" "}
            </button>
                     {" "}
          </form>
                 {" "}
        </div>
             {" "}
      </div>
         {" "}
    </AdminLayout>
  );
};

export default AddTour;
