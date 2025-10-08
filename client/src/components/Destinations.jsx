import React from "react";
import DaLat from "../assets/images/DaLat.jpg";
import DaNang from "../assets/images/DaNang.jpg";
import NhaTrang from "../assets/images/NhaTrang.jpg";
import QuyNhon from "../assets/images/QuyNhon.jpg";

const destinations = [
  {
    name: "Đà Lạt",
    img: DaLat,
  },
  {
    name: "Đà Nẵng",
    img: DaNang,
  },
  {
    name: "Quy Nhơn",
    img: QuyNhon,
  },
  {
    name: "Nha Trang",
    img: NhaTrang,
  },
];

const Destinations = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">
          Điểm đến phổ biến
        </h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((d, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{d.name}</h3>
                <p className="text-gray-600">{d.country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;
