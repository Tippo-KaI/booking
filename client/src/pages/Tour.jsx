import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
// Import icons
import {
  RiPlaneLine,
  RiSearchLine,
  RiMoneyEuroBoxLine,
  RiTicketLine,
  RiMapPinLine,
  RiLoader4Line,
} from "react-icons/ri";

const API_BASE_URL = "http://localhost:5000/api/tours";

const TourPage = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const navigate = useNavigate();

  // Sử dụng Ngân sách (nganSach) làm giá hiển thị
  const formatNganSach = (nganSach) => {
    return nganSach || "Liên hệ";
  };

  // ===========================================================
  // 1. HÀM FETCH TOURS (Logic giữ nguyên)
  // ===========================================================
  const fetchTours = async () => {
    setLoading(true);
    setError(null);

    const url = searchQuery
      ? `${API_BASE_URL}?search=${encodeURIComponent(searchQuery)}`
      : API_BASE_URL;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setTours(data.tours || []);
      } else {
        setError(data.message || "Không thể tải dữ liệu tour.");
        setTours([]);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Lỗi kết nối server.");
      setTours([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  // -----------------------------------------------------------
  // 2. HÀM XỬ LÝ CLICK -> CHUYỂN HƯỚNG SANG TRANG ĐẶT TOUR
  // -----------------------------------------------------------
  const handleTourClick = (tourId) => {
    // Chuyển hướng đến Route /tour/book/:tourId
    navigate(`/tour/${tourId}`);
  };

  let content;

  if (loading) {
    content = (
      <div className="text-center py-10 text-blue-600 font-semibold flex items-center justify-center gap-2">
        <RiLoader4Line className="animate-spin w-5 h-5" /> Đang tải danh sách
        Tour...
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-8 px-4 bg-red-50 text-red-600 font-medium rounded-lg shadow-sm border border-red-300 max-w-7xl mx-auto">
        ❌ Lỗi tải dữ liệu: {error}
      </div>
    );
  } else if (tours.length === 0) {
    content = (
      <div className="text-center py-10 text-gray-500 font-medium text-lg max-w-7xl mx-auto">
        <RiPlaneLine className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        Không tìm thấy tour nào {searchQuery && `với từ khóa "${searchQuery}"`}.
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 md:p-8">
        {tours.map((tour) => (
          <div
            key={tour._id}
            onClick={() => handleTourClick(tour._id)} // 👈 THẺ CHA CLICK: CHUYỂN HƯỚNG
            // items-stretch: Đảm bảo cả hai cột (ảnh và nội dung) có chiều cao bằng nhau
            className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition flex flex-row items-stretch gap-4 cursor-pointer"
          >
            {/* Ảnh đại diện: CỐ ĐỊNH KÍCH THƯỚC */}
            <img
              src={
                tour.anhDaiDien ||
                "https://via.placeholder.com/150x100?text=Tour+Image"
              }
              alt={tour.tenTour}
              className="h-36 w-36 object-cover rounded-lg flex-shrink-0 shadow-md"
            />

            {/* Nội dung Tour: PHẢI DÙNG FLEX COLUMN VÀ H-FULL */}
            <div className="flex-grow flex flex-col h-full">
              {/* 1. KHỐI THÔNG TIN TRÊN */}
              <div>
                <h3 className="font-extrabold text-xl text-slate-800 mb-2 leading-snug line-clamp-2">
                  {tour.tenTour}
                </h3>

                {/* Thẻ thông tin */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm mt-1 mb-3">
                  <span className="inline-flex items-center gap-1 text-gray-600 font-medium">
                    <RiMapPinLine className="w-4 h-4 text-blue-500" />
                    {tour.diaDiem}
                  </span>

                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                    <RiTicketLine className="w-3 h-3" />
                    {tour.loaiHinh}
                  </span>

                  {/* Ngân sách */}
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                    <RiMoneyEuroBoxLine className="w-3 h-3" />
                    {formatNganSach(tour.nganSach)}
                  </span>
                </div>

                {/* Mô tả */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {tour.moTa}
                </p>
              </div>

              {/* 2. NÚT ĐẶT TOUR TRỰC TIẾP (ĐẨY XUỐNG DƯỚI BẰNG mt-auto) */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn click lan truyền lên thẻ cha
                  handleTourClick(tour._id);
                }}
                className="mt-auto bg-green-600 text-white font-semibold py-2 px-4 text-sm rounded-lg shadow-md transition hover:bg-red-700 transform hover:-translate-y-0.5"
              >
                Gửi Yêu cầu Đặt Tour
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {/* THANH TÌM KIẾM CHUYÊN DỤNG */}
      <div className="bg-white shadow-md py-4 mb-8">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl flex items-center justify-between">
          <input
            type="text"
            placeholder="Tìm tour (Địa điểm, Loại hình, Tên tour...)"
            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button
            onClick={handleSearch}
            className="ml-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
          >
            <RiSearchLine className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* TIÊU ĐỀ */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 flex items-center gap-3 border-b-2 border-gray-200 pb-2">
          <RiPlaneLine className="text-blue-600 w-6 h-6" /> Danh sách Tour
          {searchQuery && (
            <span className="text-xl text-gray-500">
              ({tours.length} kết quả)
            </span>
          )}
        </h2>
      </div>

      {/* KHỐI NỘI DUNG CHÍNH */}
      <div className="container mx-auto max-w-7xl">{content}</div>
    </div>
  );
};

export default TourPage;
