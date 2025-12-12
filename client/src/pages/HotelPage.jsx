import React, { useState, useEffect } from "react";
import Header from "../components/Header";
// Import icons
import {
  RiHotelLine,
  RiStarFill,
  RiMapPinLine,
  RiMoneyEuroBoxLine,
  RiLoader4Line,
  RiCloseCircleLine,
  RiSearchLine,
} from "react-icons/ri";

const API_BASE_URL = "http://localhost:5000/api/admin/hotels";

const HotelPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const formatPrice = (price) => {
    if (price === undefined || price === null || price === 0)
      return "Giá liên hệ";
    return price.toLocaleString("vi-VN") + " VNĐ/đêm";
  };

  const renderStars = (hangSao) => {
    const rating = hangSao || 0;
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <RiStarFill
            key={i}
            className="w-4 h-4 text-yellow-500 inline-block"
          />
        );
      } else {
        stars.push(
          <RiStarFill key={i} className="w-4 h-4 text-gray-300 inline-block" />
        );
      }
    }
    return (
      <span className="flex items-center gap-0.5 align-middle">{stars}</span>
    );
  };

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);
    const url = searchQuery
      ? `${API_BASE_URL}?search=${encodeURIComponent(searchQuery)}`
      : API_BASE_URL;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setHotels(data.hotels || []);
      } else {
        setError(data.message || "Không thể tải dữ liệu Khách sạn.");
        setHotels([]);
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Lỗi kết nối server.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [searchQuery]);

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleHotelClick = (linkDatPhong) => {
    if (linkDatPhong) {
      window.open(linkDatPhong, "_blank");
    }
  };

  let content;

  if (loading) {
    content = (
      <div className="text-center py-20 text-blue-600 font-semibold flex items-center justify-center gap-2">
        <RiLoader4Line className="animate-spin w-5 h-5" /> Đang tải danh sách
        Khách sạn...
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-20 p-4 bg-red-50 text-red-600 font-medium rounded-xl shadow-sm border border-red-300 flex items-center justify-center gap-2">
        <RiCloseCircleLine className="w-6 h-6" /> Lỗi tải dữ liệu: {error}
      </div>
    );
  } else if (hotels.length === 0) {
    content = (
      <div className="text-center py-20 text-gray-500 text-lg">
        <RiHotelLine className="w-8 h-8 mx-auto mb-3 text-gray-400" />
        Hiện tại không có chỗ nghỉ nào khả dụng{" "}
        {searchQuery && `với từ khóa "${searchQuery}"`}.
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            onClick={() => handleHotelClick(hotel.linkDatPhong)}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
          >
            <img
              src={
                hotel.anhDaiDien ||
                "https://via.placeholder.com/400x250?text=Hotel+Image"
              }
              alt={hotel.tenKhachSan}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 flex flex-col flex-grow">
              {/* KHỐI TIÊU ĐỀ + RATING CÓ CHIỀU CAO CỐ ĐỊNH */}
              {/* H-24 (khoảng 6rem) đủ cho 2 dòng tiêu đề + rating 1 dòng */}
              <div className="flex flex-col flex-shrink-0 h-24 mb-3 justify-between">
                <h3 className="font-extrabold text-lg text-slate-800 line-clamp-2 leading-snug">
                  {hotel.tenKhachSan}
                </h3>

                {/* Rating và Loại hình - Đã đặt h-6 trong khối trước đó, loại bỏ h-6 ở đây */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-yellow-500 font-bold">
                    {renderStars(hotel.hangSao)}
                  </span>
                  <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded text-xs font-medium">
                    {hotel.loaiHinh}
                  </span>
                </div>
              </div>

              {/* KHỐI THÔNG TIN VỊ TRÍ */}
              <p className="text-sm text-gray-600 mb-4 flex items-center gap-2">
                <RiMapPinLine className="w-4 h-4 text-orange-500" />
                {hotel.tinhThanh}
              </p>

              {/* KHỐI GIÁ VÀ CTA (Đẩy xuống cuối bằng mt-auto) */}
              <div className="pt-3 border-t border-gray-100 mt-auto">
                <p className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <RiMoneyEuroBoxLine className="w-4 h-4" /> Giá từ:
                </p>
                <p className="text-red-600 font-extrabold text-xl">
                  {formatPrice(hotel.giaThapNhat)}
                </p>
                <button className="w-full mt-3 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md hover:bg-blue-700 transition">
                  Xem chi tiết & Đặt phòng
                </button>
              </div>
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
            placeholder="Tìm khách sạn (Tên, Địa điểm, Loại hình...)"
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

      {/* TIÊU ĐỀ & KẾT QUẢ */}
      <main className="container mx-auto px-4 md:px-8 py-0">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800 flex items-center gap-3">
          <RiHotelLine className="w-8 h-8 text-yellow-600" /> Lưu Trú & Khách
          Sạn Tốt Nhất
        </h1>
        {/* Hiển thị số lượng kết quả tìm kiếm */}
        {searchQuery && (
          <p className="text-lg text-gray-600 mb-6 border-b-2 border-gray-200 pb-2">
            Tìm thấy **{hotels.length}** kết quả cho từ khóa: **"{searchQuery}
            "**
          </p>
        )}

        {content}
      </main>

      {/* Footer (Giả định cần thêm Footer nếu có) */}
      {/* <Footer /> */}
    </div>
  );
};

export default HotelPage;
