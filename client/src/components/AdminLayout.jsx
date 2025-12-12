import React from "react";
import { Link, useLocation } from "react-router-dom";
// Import các biểu tượng mẫu từ React Icons
import {
  RiPlaneLine,
  RiCalendarEventLine,
  RiHotelLine,
  RiUser3Line,
  RiSettings3Line,
  RiMoneyEuroBoxLine, // ICON MỚI CHO BOOKING
  RiFileList3Line, // ICON MỚI CHO INVOICE
} from "react-icons/ri";

const adminMenuItems = [
  { type: "header", name: "QUẢN LÝ DỊCH VỤ" },
  { name: "Quản lý Tours", path: "/admin/manage-tours", icon: RiPlaneLine },
  {
    name: "Quản lý Sự kiện",
    path: "/admin/manage-events",
    icon: RiCalendarEventLine,
  },
  {
    name: "Quản lý Khách sạn",
    path: "/admin/manage-hotels",
    icon: RiHotelLine,
  },

  // KHỐI MỚI CHO QUẢN LÝ ĐẶT CHỖ/TÀI CHÍNH
  { type: "header", name: "ĐẶT CHỖ & TÀI CHÍNH" },
  {
    name: "Quản lý Đặt Tour", // Trang AdminBookingPage
    path: "/admin/manage-bookings",
    icon: RiMoneyEuroBoxLine,
  },

  { type: "header", name: "HỆ THỐNG" },
  {
    name: "Quản lý Người dùng",
    path: "/admin/manage-users",
    icon: RiUser3Line,
  },
  // Thêm mục Cấu hình bị thiếu (nếu cần)
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  // Điều chỉnh activePath để khớp với path='/admin' nếu đang ở trang tổng quan
  const activePath = location.pathname;

  return (
    <div className="flex h-screen bg-gray-50 antialiased text-gray-700">
      {/* ---------------- Sidebar ---------------- */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-30 flex flex-col border-r border-gray-100">
        {/* Logo + Title */}
        <div className="px-6 py-5 border-b border-gray-100 bg-slate-800 text-white flex-shrink-0">
          <Link
            to="/dashboard"
            className="text-xl font-extrabold flex items-center gap-2"
          >
            <RiSettings3Line className="text-blue-400 text-2xl" />
            ADMIN PANEL
          </Link>
        </div>

        {/* Menu */}
        {/* Tối ưu hóa padding dọc và đảm bảo cuộn nếu nội dung dài */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
          {adminMenuItems.map((item, index) => {
            if (item.type === "header") {
              return (
                <p
                  key={index}
                  // Cân bằng khoảng cách trên/dưới cho Header
                  className="text-xs font-bold text-gray-400 uppercase mt-6 mb-2 px-3 tracking-wide"
                >
                  {item.name}
                </p>
              );
            }

            // Xử lý Active State
            const isActive =
              activePath === item.path ||
              (activePath === "/admin" && item.path === "/admin/dashboard");
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-3 rounded-xl text-sm transition-all duration-200 shadow-sm
                  ${
                    isActive
                      ? "bg-blue-600 text-white font-semibold shadow-blue-500/30"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {Icon && <Icon className="w-5 h-5 mr-3" />}
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ---------------- Content ---------------- */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-full">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
