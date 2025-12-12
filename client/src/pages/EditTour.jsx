// src/pages/admin/EditTour.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
// Import icons
import {
  RiPlaneLine,
  RiPencilLine,
  RiMapPinLine,
  RiQuillPenLine,
  RiUploadCloudLine,
  RiMoneyEuroBoxLine,
  RiTicketLine,
  RiLink,
  RiLoader4Line,
  RiArrowGoBackLine,
} from "react-icons/ri";

const API_BASE = "http://localhost:5000/api/admin/tours";
const API_UPLOAD = "http://localhost:5000/api/upload"; // Endpoint Upload Ảnh

// Khởi tạo tourData ban đầu với cấu trúc đầy đủ
const initialTourData = {
  tenTour: "",
  diaDiem: "",
  moTa: "",
  linkAffiliate: "",
  anhDaiDien: "",
  loaiHinh: "Biển",
  nganSach: "Trung bình",
};

const EditTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tourData, setTourData] = useState(initialTourData);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false); // State cho upload ảnh
  const [message, setMessage] = useState(""); // 1. Fetch dữ liệu Tour hiện tại

  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const res = await fetch(`${API_BASE}/${id}`);
        const data = await res.json();
        if (res.ok) {
          // Đảm bảo dữ liệu nhận được khớp với state
          setTourData(data.tour);
        } else {
          setMessage(`❌ Không tìm thấy Tour có ID: ${id}`);
        }
      } catch (error) {
        setMessage("❌ Lỗi kết nối Server khi tải chi tiết Tour.");
      } finally {
        setLoadingFetch(false);
      }
    };
    fetchTourDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTourData((prevData) => ({ ...prevData, [name]: value }));
    setMessage("");
  };

  // Hàm xử lý upload ảnh
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoadingUpload(true);
    setMessage("");

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch(API_UPLOAD, {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setTourData((prevData) => ({ ...prevData, anhDaiDien: data.url }));
        setMessage(
          "✅ Upload ảnh thành công! Vui lòng nhấn Cập Nhật Tour để lưu."
        );
      } else {
        setMessage("❌ Upload ảnh thất bại!");
      }
    } catch (err) {
      setMessage("❌ Lỗi upload ảnh!");
    } finally {
      setLoadingUpload(false);
      e.target.value = null; // Reset input file
    }
  }; // 2. Submit dữ liệu chỉnh sửa

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setMessage("");

    // Đảm bảo không gửi object null hoặc thiếu ID
    if (!tourData || !id) {
      setLoadingUpdate(false);
      return setMessage("❌ Lỗi dữ liệu Tour.");
    }

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // Gửi toàn bộ dữ liệu form đã cập nhật
        body: JSON.stringify(tourData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(
          `✅ Tour "${tourData.tenTour}" đã được cập nhật thành công! Quay lại trang quản lý sau 2 giây.`
        ); // Quay lại trang quản lý sau 2 giây
        setTimeout(() => navigate("/admin/manage-tours"), 2000);
      } else {
        setMessage(`❌ Lỗi cập nhật Tour: ${data.message || "Lỗi server"}`);
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
          <RiLoader4Line className="animate-spin" /> Đang tải thông tin Tour...
        </p>
      </AdminLayout>
    );
  if (!tourData.tenTour)
    // Kiểm tra nếu dữ liệu không có (chứ không phải loading)
    return (
      <AdminLayout>
        <p className="text-red-600 font-semibold text-lg">
          {message || "Không tìm thấy dữ liệu Tour."}
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <RiPencilLine className="text-blue-600 w-7 h-7" /> Sửa Tour:{" "}
          {tourData.tenTour}
        </h2>
        <button
          onClick={() => navigate("/admin/manage-tours")}
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
        {/* Tên Tour */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiTicketLine /> Tên Tour
          </label>
          <input
            type="text"
            name="tenTour"
            value={tourData.tenTour}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Địa điểm */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiMapPinLine /> Địa điểm chính
          </label>
          <input
            type="text"
            name="diaDiem"
            value={tourData.diaDiem}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Link Affiliate */}
        <div className="flex flex-col">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiLink /> Link đặt Tour (Affiliate)
          </label>
          <input
            type="url"
            name="linkAffiliate"
            value={tourData.linkAffiliate}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Loại hình và Ngân sách */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Loại hình */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiTicketLine /> Loại hình
            </label>
            <select
              name="loaiHinh"
              value={tourData.loaiHinh}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            >
              <option value="Biển">Biển</option>
              <option value="Núi">Núi</option>
              <option value="Văn hóa">Văn hóa</option>
              <option value="Nghỉ dưỡng">Nghỉ dưỡng</option>
              <option value="Phiêu lưu">Phiêu lưu</option>
            </select>
          </div>
          {/* Ngân sách */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
              <RiMoneyEuroBoxLine /> Ngân sách
            </label>
            <select
              name="nganSach"
              value={tourData.nganSach}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            >
              <option value="Thấp">Thấp</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Cao">Cao</option>
            </select>
          </div>
        </div>

        {/* Upload ảnh và Preview */}
        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm text-gray-500 font-bold uppercase mb-2 flex items-center gap-2">
            <RiUploadCloudLine /> Ảnh Đại Diện (Chọn ảnh mới để thay thế)
          </label>
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Ảnh Hiện tại */}
            {tourData.anhDaiDien && (
              <div className="flex-shrink-0">
                <p className="text-xs text-gray-500 mb-1">Ảnh Hiện Tại:</p>
                <img
                  src={tourData.anhDaiDien}
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
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
        <div className="pt-4 border-t border-gray-100">
          <label className="text-sm text-gray-500 font-bold uppercase mb-1 flex items-center gap-2">
            <RiQuillPenLine /> Mô tả chi tiết Tour
          </label>
          <textarea
            rows="4"
            name="moTa"
            value={tourData.moTa}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loadingUpdate || loadingUpload}
          className={`w-full py-3 rounded-xl text-white font-semibold transition duration-300 shadow-md flex items-center justify-center gap-2
            ${
              loadingUpdate || loadingUpload
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/40"
            }`}
        >
          {loadingUpdate ? (
            <>
              <RiLoader4Line className="animate-spin" /> Đang Cập Nhật...
            </>
          ) : (
            "Cập Nhật Tour"
          )}
        </button>
      </form>
    </AdminLayout>
  );
};

export default EditTour;
