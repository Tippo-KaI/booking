import React from "react";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Destinations from "../components/Destinations";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <header className="bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center py-4 px-6">
            <div>
              <Link
                to="/"
                className="text-2xl font-bold text-blue-600 cursor-pointer"
              >
                Booki
              </Link>
            </div>
            <button
              onClick={() => navigate("/Login")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
            >
              Đặt ngay
            </button>
          </div>
        </header>
      </div>
      <Hero />
      <Feature />
      <Destinations />
      <Footer />
    </div>
  );
};

export default Landing;
