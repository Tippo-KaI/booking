import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";
import DaLat from "../assets/images/DaLat.jpg";
import DaNang from "../assets/images/DaNang.jpg";
import NhaTrang from "../assets/images/NhaTrang.jpg";

const TourPage = () => {
  const tours = [
    {
      id: 1,
      img: DaLat,
      name: "Tour Đà Lạt",
      description: "Khám phá Đà Lạt trong 3 ngày 2 đêm.",
    },
    {
      id: 2,
      img: NhaTrang,
      name: "Tour Nha Trang",
      description: "Tham quan biển đảo và lặn ngắm san hô.",
    },
    {
      id: 3,
      img: DaNang,
      name: "Tour Đà Nẵng",
      description: "Check-in Bà Nà Hills và cầu Vàng.",
    },
  ];

  const handleSearch = (query) => {
    console.log("Tìm tour:", query);
  };

  return (
    <div>
      <Header />
      <DashboardLayout placeholder="Tìm tour..." onSearch={handleSearch}>
        <h2 className="text-xl font-bold mb-4">Danh sách Tour</h2>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
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

export default TourPage;
