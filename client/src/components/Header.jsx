import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white shadow-md top-0 left-0 z-50 w-full">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            Booki
          </Link>
        </div>
        <nav className="space-x-6 hidden md:block">
          <Link to="/dashboard" className="hover:text-blue-600">
            Trang chủ
          </Link>
          <Link to="/tour" className="hover:text-blue-600">
            Tour
          </Link>
          <Link to="/hotel" className="hover:text-blue-600">
            Khách sạn & Lưu trú
          </Link>
          <Link to="/event" className="hover:text-blue-600">
            Sự kiện nổi bật
          </Link>
          <Link to="/userinfo">Account</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
