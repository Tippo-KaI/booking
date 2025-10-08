import React from "react";
import VNimage from "../assets/images/VN-image.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative bg-blue-100">
      <div className="container mx-auto flex flex-col md:flex-row items-center py-16 px-6">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Khám phá{" "}
            <span className="bg-gradient-to-tl from-red-500 via-yellow-400 bg-clip-text text-transparent">
              Việt Nam
            </span>{" "}
            dễ dàng với <span className="text-blue-600">Booki</span>
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Tìm kiếm chuyến đi hoàn hảo chỉ trong vài bước đơn giản. Trải nghiệm
            du lịch dễ dàng, nhanh chóng và tiện lợi.
          </p>
        </div>
        <div className="flex-1 mt-10 md:mt-0 ml-20">
          <img src={VNimage} alt="Travel" />
        </div>
      </div>
      <Link to="/dashboard">Dashboard</Link>
    </section>
  );
};

export default Hero;
