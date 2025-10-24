import { useNavigate } from "react-router-dom";
import React from "react";
import Header from "../components/Header";
import DashboardLayout from "../components/DashboardLayout";
import DaLat from "../assets/images/DaLat.jpg";
import DaNang from "../assets/images/DaNang.jpg";
import NhaTrang from "../assets/images/NhaTrang.jpg";

const DashBoard = () => {
  const navigate = useNavigate();
  const tours = [
    {
      id: 1,
      img: DaLat,
      name: "Tour ",
      description: "Lên kế hoạch dễ dàng và nhanh chóng",
    },
    {
      id: 2,
      img: DaNang,
      name: "Ưu đãi cuối tuần",
      description: "Tiết kiệm cho chỗ nghỉ ",
    },
    {
      id: 3,
      img: NhaTrang,
      name: "Lưu trú tại các chỗ nghỉ độc đáo hàng đầu",
      description:
        "Từ biệt thự, lâu đài cho đến nhà thuyền, igloo, chúng tôi đều có hết",
    },
  ];

  const handleSearch = (query) => {
    console.log("Tìm tour:", query);
  };
  const handleTourClick = (id) => {
    navigate(`/tour/${id}`); 
  };
  return (
    <div>
      <Header />
      <DashboardLayout placeholder="Tìm kiếm..." onSearch={handleSearch}>
        <h2 className="text-xl font-bold mb-4">Nổi bật</h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
              onClick={() => handleTourClick(tour.id)}
              className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition flex items-center gap-4"
            >
              <img
                src={tour.img}
                alt={tour.name}
                className="h-32 w-48 object-cover rounded-lg flex-shrink-0"
              />
              <div>
                <h3 className="font-semibold text-lg">{tour.name}</h3>
                <p className="text-gray-600 mt-2">{tour.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </div>
  );
};

export default DashBoard;
