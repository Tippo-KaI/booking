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
          <Link to="/places" className="hover:text-blue-600">
            Địa điểm
          </Link>
          <Link to="/offers" className="hover:text-blue-600">
            Ưu đãi
          </Link>
          <Link to="/contact" className="hover:text-blue-600">
            Liên hệ
          </Link>
        </nav>
      </div>

      <div className="flex justify-center gap-15 bg-gradient-to-tr from-blue-500 to-purple-500 w-full py-4">
        <Link to="/tour">Tour</Link>
        <Link to="/chuyenbay">Chuyến Bay</Link>
        <Link to="/luutru">Lưu trú</Link>
        <Link to="/dichuyen">Di Chuyển</Link>
        <Link to="/hoatdong">Hoạt Động</Link>
      </div>
    </header>
  );
};

export default Header;
