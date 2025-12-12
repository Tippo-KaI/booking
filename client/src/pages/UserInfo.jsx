// src/pages/UserProfilePage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

// Import icons từ lucide-react (không lỗi export)
import {
  LogOut,
  User,
  Mail,
  Calendar,
  PlaneTakeoff,
  Loader,
  History,
  Clock,
  XCircle,
  CheckCircle,
  Users,
  DollarSign,
} from "lucide-react";

const API_USER_INFO = "http://localhost:5000/api/users/info";
const API_MY_BOOKINGS = "http://localhost:5000/api/bookings/my-tours";

const formatCurrency = (amount) => {
  return amount ? amount.toLocaleString("vi-VN") + " VNĐ" : "—";
};

const UserInfo = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    hoTen: "",
    email: "",
    ngayDangKy: "",
  });

  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingError, setBookingError] = useState(null);

  const [loadingUser, setLoadingUser] = useState(true);
  const [userError, setUserError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const checkAuthAndToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("token");
      navigate("/login");
      return false;
    }
    return token;
  };

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch(API_USER_INFO, {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error(`Lỗi Server khi tải hồ sơ: ${res.status}`);
      }

      const data = await res.json();
      setUser({
        hoTen: data.hoTen || "Người dùng",
        email: data.email || "N/A",
        ngayDangKy: data.ngayDangKy
          ? new Date(data.ngayDangKy).toLocaleDateString("vi-VN")
          : "N/A",
      });
    } catch (err) {
      setUserError(err.message);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchMyBookings = async (token) => {
    setLoadingBookings(true);
    try {
      const res = await fetch(API_MY_BOOKINGS, {
        headers: { authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        setBookingError(data.message || `Lỗi tải đơn hàng: ${res.status}`);
      }
    } catch {
      setBookingError("Lỗi kết nối Server khi tải đơn hàng.");
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    const token = checkAuthAndToken();
    if (token) {
      fetchUserInfo(token);
      fetchMyBookings(token);
    }
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      case "Cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Pending":
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Confirmed":
        return <CheckCircle className="w-4 h-4 mr-1 text-green-600" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4 mr-1 text-red-600" />;
      case "Completed":
        return <CheckCircle className="w-4 h-4 mr-1 text-blue-600" />;
      case "Pending":
      default:
        return <Clock className="w-4 h-4 mr-1 text-yellow-600" />;
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      </div>
    );
  }

  if (userError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto mt-16 p-8 text-center bg-red-50 border border-red-300 rounded-xl shadow-lg">
          <p className="text-red-600 font-semibold text-lg">
            <XCircle className="w-6 h-6 inline mr-2" /> Lỗi khi tải hồ sơ!
          </p>
          <p className="text-red-500 text-sm mt-2">{userError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 border-b-2 border-purple-500 pb-3 flex items-center gap-2">
          <User className="w-7 h-7 text-purple-600" /> Hồ sơ & Lịch sử Đặt Tour
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar trái */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center h-fit sticky top-20 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-1">
                {user.hoTen}
              </h2>
              <p className="text-gray-500 text-sm mb-6 text-center border-b pb-4 w-full">
                {user.email}
              </p>

              <div className="w-full text-center mb-6">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                  <Calendar className="w-4 h-4" /> Thành viên từ
                </p>
                <p className="text-xl font-extrabold text-purple-600">
                  {user.ngayDangKy}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-600 border border-red-300 bg-red-50 hover:bg-red-100 transition font-bold shadow-md"
              >
                <LogOut className="w-5 h-5" /> Đăng xuất
              </button>
            </div>
          </div>

          {/* Lịch sử đặt tour */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-green-500 pb-2 flex items-center gap-2">
              <History className="w-6 h-6 text-green-600" /> Lịch sử Đặt Tour
            </h2>

            {bookingError && (
              <div className="p-4 bg-red-100 text-red-700 rounded-xl flex items-center gap-2 border border-red-300">
                <XCircle className="w-5 h-5" /> {bookingError}
              </div>
            )}

            {loadingBookings ? (
              <div className="text-center py-10">
                <Loader className="animate-spin w-6 h-6 inline mr-2 text-green-600" />
                Đang tải đơn hàng...
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-xl shadow-md text-gray-500">
                <PlaneTakeoff className="w-8 h-8 mx-auto mb-3" />
                Bạn chưa có yêu cầu đặt tour nào.
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white p-5 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start border-b pb-2 mb-3">
                      <h4 className="font-extrabold text-xl text-slate-800">
                        {booking.tenTour ||
                          booking.tourId?.tenTour ||
                          "Tour N/A"}
                      </h4>

                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center border ${getStatusStyle(
                          booking.trangThai
                        )}`}
                      >
                        {getStatusIcon(booking.trangThai)} {booking.trangThai}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-500" />
                        Ngày đi:
                        <strong className="text-gray-800">
                          {new Date(booking.ngayKhoiHanh).toLocaleDateString(
                            "vi-VN"
                          )}
                        </strong>
                      </p>

                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        Số lượng:
                        <strong className="text-gray-800">
                          {booking.soLuongNguoi} người
                        </strong>
                      </p>

                      <p className="sm:col-span-2 text-red-600 font-bold flex items-center gap-2 text-lg">
                        Tổng chi phí: {formatCurrency(booking.tongChiPhi)}
                      </p>

                      <p className="text-xs text-gray-500 sm:col-span-2">
                        Mã đơn: #{booking._id.slice(-8).toUpperCase()} | Ngày
                        đặt:
                        {new Date(booking.ngayTao).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/bookingconfirmation/${booking._id}`)
                      }
                      className="mt-4 text-sm px-4 py-2 bg-purple-100 text-purple-700 font-semibold rounded-lg hover:bg-purple-200 transition shadow-sm"
                    >
                      Xem chi tiết & Thanh toán
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
