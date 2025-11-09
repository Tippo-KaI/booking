import React, { useEffect, useState } from "react";
import VNimage from "../assets/images/VN-image.png";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e) => {
    if (e.clientX < window.innerWidth * 0.2) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const handleMouseLeave = () => setShowButton(false);

  return (
    <section
      className="relative bg-blue-100 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center py-16 px-6">
        <div
          className={`flex-1 text-center md:text-left ${
            mounted ? "fade-in-up" : "opacity-0"
          }`}
        >
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

        <div
          className={`flex-1 mt-10 md:mt-0 ml-0 md:ml-20 ${
            mounted ? "fade-in-up fade-in-delay-200" : "opacity-0"
          }`}
        >
          <img
            src={VNimage}
            alt="Travel"
            className="rounded-2xl max-w-full h-auto"
          />
        </div>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className={`fixed bottom-16 left-8 flex items-center gap-2 px-6 py-3 
          bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 
          text-white font-semibold rounded-full shadow-lg
          transform transition-all duration-300 ease-out
          ${showButton ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
      >
        <LayoutDashboard size={22} />
        <span className="whitespace-nowrap">Dashboard</span>
      </button>
    </section>
  );
};

export default Hero;
