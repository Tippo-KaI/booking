import React from "react";
import {
  RiMapPinLine,
  RiPlaneLine,
  RiHotelLine,
  RiCalendarEventLine,
} from "react-icons/ri";
import Header from "../components/Header";

// Ảnh demo
import DaLat from "../assets/images/DaLat.jpg";
import DaNang from "../assets/images/DaNang.jpg";
import NhaTrang from "../assets/images/NhaTrang.jpg";

const DashBoard = () => {
  const features = [
    {
      name: "Tìm kiếm & Đặt Tour Du lịch",
      subtitle: "CHỨC NĂNG CHÍNH",
      description:
        "Khám phá hàng trăm tour du lịch trọn gói đến các điểm đến hàng đầu Việt Nam. Xem chi tiết lịch trình, ngày khởi hành, và đặt chỗ ngay lập tức với các đối tác tin cậy của chúng tôi.",
      image: DaLat,
      linkPath: "/tour",
      icon: RiPlaneLine,
      buttonText: "Khám phá Tours",
    },
    {
      name: "Đặt Lưu trú & Khách sạn",
      subtitle: "TÌM KIẾM LINH HOẠT",
      description:
        "Tìm kiếm và so sánh các chỗ nghỉ độc đáo: từ khách sạn 5 sao, resort nghỉ dưỡng cho đến homestay ấm cúng. Nền tảng liên kết với các nguồn dữ liệu giá tốt nhất cho chuyến đi của bạn.",
      image: NhaTrang,
      linkPath: "/luutru",
      icon: RiHotelLine,
      buttonText: "Tìm Khách sạn",
    },
    {
      name: "Sự kiện & Hoạt động Địa phương",
      subtitle: "TRẢI NGHIỆM ĐỊA PHƯƠNG",
      description:
        "Cập nhật các lễ hội, sự kiện văn hóa, và các hoạt động giải trí độc đáo diễn ra tại các điểm đến du lịch trên toàn quốc. Đừng bỏ lỡ các trải nghiệm văn hóa thú vị!",
      image: DaNang,
      linkPath: "/event",
      icon: RiCalendarEventLine,
      buttonText: "Xem Sự kiện",
    },
  ];

  return (
    <div>
      <Header />

      {/* THẺ CONTAINER CHÍNH - ĐÃ THÊM PADDING BOTTOM LỚN (pb-20) */}
      <div className="container mx-auto px-6 pt-10 space-y-20 lg:space-y-32 pb-20">
        {/* KHỐI GIỚI THIỆU CHUNG */}
        <div className="text-center mb-10 pt-4">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-3">
            Kỳ nghỉ hoàn hảo bắt đầu từ đây!
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nền tảng giúp bạn kết nối mọi dịch vụ du lịch: Tour, Khách sạn và
            Trải nghiệm Địa phương một cách dễ dàng và trực quan.
          </p>
        </div>

        {/* VÒNG LẶP CÁC CHỨC NĂNG */}
        {features.map((item, index) => {
          const reversed = index % 2 !== 0; // Áp dụng bố cục xen kẽ
          const IconComponent = item.icon;
          const subtitleColor =
            index === 0
              ? "text-blue-600"
              : index === 1
              ? "text-yellow-600"
              : "text-purple-600";

          return (
            <div
              key={index}
              className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 ${
                reversed ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* IMAGE BLOCK */}
              <div className="w-full lg:w-1/2 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded-2xl w-full h-[300px] object-cover shadow-2xl shadow-gray-400/50"
                />

                {/* Location/Function Tag */}
                <div className="absolute top-4 left-4 bg-white text-gray-900 px-4 py-2 rounded-xl flex items-center text-base font-bold shadow-md">
                  <IconComponent className="mr-2 w-5 h-5" />{" "}
                  {item.name.split(" ").pop()}
                </div>
              </div>

              {/* CONTENT BLOCK */}
              <div className="w-full lg:w-1/2">
                <p
                  className={`font-bold tracking-widest uppercase mb-2 ${subtitleColor}`}
                >
                  {item.subtitle}
                </p>

                <h2 className="text-4xl font-extrabold text-slate-900 mb-4 leading-snug">
                  {item.name}
                </h2>

                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  {item.description}
                </p>

                <button
                  onClick={() => (window.location.href = item.linkPath)}
                  className="px-6 py-3 rounded-full bg-gray-900 text-white hover:bg-gray-700 transition font-semibold shadow-lg"
                >
                  {item.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashBoard;
