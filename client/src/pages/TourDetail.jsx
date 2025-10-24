// src/pages/TourDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";

// Nếu bạn có ảnh trong /src/assets/images, import ở đây:
import DaLat from "../assets/images/DaLat.jpg";
import DaNang from "../assets/images/DaNang.jpg";
import NhaTrang from "../assets/images/NhaTrang.jpg";

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // DỮ LIỆU THỦ CÔNG (mock data)
  const sampleTours = [
    {
      id: "1",
      name: "Tour Đà Lạt - Lãng mạn mùa hoa",
      location: "Đà Lạt, Lâm Đồng",
      price: 1500000,
      duration: "3 ngày 2 đêm",
      capacity: 20,
      image: DaLat,
      short: "Trải nghiệm không khí se lạnh, đồi thông, hồ Xuân Hương và vườn hoa tuyệt đẹp.",
      description:
        "Hành trình 3 ngày 2 đêm ở Đà Lạt: thăm thác Datanla, đi chợ đêm, thưởng thức cà phê phong cách địa phương, và dạo quanh những con đường đầy hoa.",
      itinerary: [
        "Ngày 1: Khởi hành — Tham quan Hồ Xuân Hương — Dạo chợ đêm",
        "Ngày 2: Thác Datanla — Vườn hoa thành phố — Làng Cù Lần",
        "Ngày 3: Thiền viện Trúc Lâm — Trả khách"
      ],
    },
    {
      id: "2",
      name: "Ưu đãi Đà Nẵng cuối tuần",
      location: "Đà Nẵng",
      price: 900000,
      duration: "2 ngày 1 đêm",
      capacity: 30,
      image: DaNang,
      short: "Cuối tuần biển xanh, cầu Rồng và ẩm thực miền Trung.",
      description:
        "Khám phá bãi biển Mỹ Khê, Cầu Rồng, và dùng bữa tại những quán ăn đặc sản Đà Nẵng.",
      itinerary: [
        "Ngày 1: Tắm biển Mỹ Khê — Cầu Rồng về đêm",
        "Ngày 2: Bán đảo Sơn Trà — Chợ Hàn"
      ],
    },
    {
      id: "3",
      name: "Lưu trú Nha Trang - Biển và chill",
      location: "Nha Trang",
      price: 1200000,
      duration: "3 ngày 2 đêm",
      capacity: 18,
      image: NhaTrang,
      short: "Biển xanh, đảo yến, thưởng thức hải sản tươi ngon.",
      description:
        "Tour khám phá Nha Trang bao gồm đi đảo, thưởng thức hải sản, tắm bùn và thư giãn tại resort.",
      itinerary: [
        "Ngày 1: Đảo Hòn Mun — Lặn ngắm san hô",
        "Ngày 2: VinWonders / Tắm bùn",
        "Ngày 3: Thương mại & trả khách"
      ],
    },
  ];

  // Tìm tour theo id (nếu không tìm thấy -> lấy tour đầu tiên)
  const tour = sampleTours.find((t) => t.id === id) || sampleTours[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-5xl mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline mb-4"
        >
          ← Quay lại
        </button>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Ảnh lớn */}
          <div className="relative h-80 md:h-96">
            <img
              src={tour.image}
              alt={tour.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute left-6 bottom-6 text-white">
              <h1 className="text-2xl md:text-4xl font-bold">{tour.name}</h1>
              <p className="mt-1 text-sm md:text-base">{tour.location} · {tour.duration}</p>
            </div>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: nội dung chính */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">{tour.short}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">{tour.duration}</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">{tour.capacity} người</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">{tour.location}</span>
                  </div>
                </div>
              </div>

              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
                <p className="text-gray-700 leading-relaxed">{tour.description}</p>
              </section>

              <section className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Lịch trình</h3>
                <ol className="list-decimal ml-5 space-y-2 text-gray-700">
                  {tour.itinerary.map((it, idx) => (
                    <li key={idx} className="bg-gray-50 p-3 rounded-lg">
                      {it}
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Right: box đặt tour */}
            <aside className="p-4 border rounded-xl h-fit bg-gray-50">
              <div className="flex items-baseline justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-500">Giá từ</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Number(tour.price).toLocaleString()} VND
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">Số người</label>
                <select className="w-full border rounded-md px-3 py-2">
                  <option>1 người</option>
                  <option>2 người</option>
                  <option>3 người</option>
                  <option>4 người</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">Ngày khởi hành</label>
                <input type="date" className="w-full border rounded-md px-3 py-2" />
              </div>

              <button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
                onClick={() => alert("Đây là mock UI — chức năng đặt tour chưa được triển khai")}
              >
                Đặt ngay
              </button>

              <button
                className="mt-3 w-full border border-gray-200 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                onClick={() => alert("Thêm vào yêu thích (mock)")}
              >
                ❤ Thêm vào yêu thích
              </button>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
