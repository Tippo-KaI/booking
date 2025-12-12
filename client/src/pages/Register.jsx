import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Import icons
import {
  RiMailLine,
  RiLockLine,
  RiUser3Line,
  RiKey2Line,
  RiLoginCircleLine,
  RiLoader4Line,
} from "react-icons/ri"; // Thêm các icon mới và RiLoader4Line

const Register = () => {
  const navigate = useNavigate();

  const [OTP, setOTP] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false); // Thêm state loading
  const [error, setError] = useState({});
  const [form, setForm] = useState({
    hoTen: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear lỗi ngay lập tức khi người dùng bắt đầu nhập
    if (error[e.target.name]) {
      setError({ ...error, [e.target.name]: null, api: null });
    } else if (e.target.name === "hoTen" && error.HoTen) {
      setError({ ...error, HoTen: null, api: null });
    } else if (e.target.name === "email" && error.Email) {
      setError({ ...error, Email: null, api: null });
    } else if (error.api) {
      setError({ ...error, api: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading

    let newError = {};

    // 1. Kiểm tra các trường BẮT BUỘC: hoTen, email, password
    if (!form.hoTen) newError.hoTen = "Vui lòng nhập Họ tên"; // Sửa key lỗi thành hoTen (đồng nhất với name)
    if (!form.email) newError.email = "Vui lòng nhập Email"; // Sửa key lỗi thành email (đồng nhất với name)
    if (!form.password) newError.password = "Vui lòng nhập Mật khẩu";
    if (!form.confirmPassword)
      newError.confirmPassword = "Vui lòng xác nhận Mật khẩu";

    // 2. Kiểm tra khớp mật khẩu
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newError.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setError(newError);
    if (Object.keys(newError).length > 0) {
      setLoading(false); // Dừng loading nếu có lỗi validation
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setShowOTP(true);
      } else {
        // Xử lý lỗi từ API
        setError({ api: data.message || "Đăng ký thất bại" });
      }
    } catch (err) {
      console.error(err);
      setError({ api: "Lỗi kết nối server" });
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading

    if (!OTP) {
      setError({ otp: "Vui lòng nhập mã OTP" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/verifyUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Chú ý: Backend của bạn có thể chỉ cần email và otp để xác thực
        // Tuy nhiên, dựa trên code cũ của bạn, tôi giữ lại formData: form
        body: JSON.stringify({ email: form.email, otp: OTP, formData: form }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Xác thực thành công! Tài khoản đã được tạo.");
        navigate("/login");
      } else {
        setError({
          otpApi: data.message || "Mã OTP không đúng hoặc đã hết hạn",
        });
      }
    } catch (err) {
      console.error(err);
      setError({ otpApi: "Lỗi kết nối server khi xác thực OTP" });
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  // --- Render Component ---
  return (
    <div className="bg-gray-50">
      {/* Header (Giống hệt Login.js) */}
      <header className="bg-white shadow-lg fixed top-0 left-0 z-50 h-16 w-full flex items-center border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-extrabold text-slate-800">
              <span className="text-blue-600">Booki</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to={"/login"}
                className="text-sm font-medium text-gray-600 hover:text-purple-600 transition"
              >
                Đăng nhập
              </Link>
              <Link
                to={"/"}
                className="bg-purple-600 text-white text-sm px-4 py-2 rounded-lg font-medium transition hover:bg-purple-700 shadow-md"
              >
                Trang chủ
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Form Container (Giống hệt Login.js) */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        {/* Form Đăng Ký / OTP */}
        <form
          onSubmit={showOTP ? handleVerifyOTP : handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 transform hover:shadow-3xl transition duration-300"
        >
          {/* Tiêu đề */}
          <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-800">
            {showOTP ? "Xác thực OTP" : "Tạo tài khoản mới!"}
          </h2>

          {/* API Error Message */}
          {(error.api || error.otpApi) && (
            <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-300 text-red-700 font-medium text-center shadow-sm">
              {error.api || error.otpApi}
            </div>
          )}

          {/* --- Form Đăng Ký Chính --- */}
          {!showOTP ? (
            <>
              {/* Họ tên */}
              <div className="mb-4">
                <label
                  htmlFor="hoTen"
                  className="block mb-1 font-semibold text-gray-700 text-sm"
                >
                  <RiUser3Line className="inline-block mr-1 w-4 h-4" /> Họ tên
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="hoTen"
                  value={form.hoTen}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    error.hoTen
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                  placeholder="Nhập họ tên của bạn"
                />
                {error.hoTen && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {error.hoTen}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-1 font-semibold text-gray-700 text-sm"
                >
                  <RiMailLine className="inline-block mr-1 w-4 h-4" /> Email
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    error.email
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                  placeholder="nhap@email.com"
                />
                {error.email && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {error.email}
                  </p>
                )}
              </div>

              {/* Mật khẩu */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-1 font-semibold text-gray-700 text-sm"
                >
                  <RiLockLine className="inline-block mr-1 w-4 h-4" /> Mật khẩu
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    error.password
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                  placeholder="Nhập mật khẩu..."
                />
                {error.password && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {error.password}
                  </p>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 font-semibold text-gray-700 text-sm"
                >
                  <RiKey2Line className="inline-block mr-1 w-4 h-4" /> Xác nhận
                  Mật khẩu
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    error.confirmPassword
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-purple-400"
                  }`}
                  placeholder="Nhập lại mật khẩu..."
                />
                {error.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {error.confirmPassword}
                  </p>
                )}
              </div>
            </>
          ) : (
            /* --- Form Xác thực OTP --- */
            <>
              <p className="text-center text-gray-600 mb-4 text-sm">
                Mã xác thực đã được gửi đến{" "}
                <b className="text-purple-600">{form.email}</b>
              </p>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block mb-1 font-semibold text-gray-700 text-sm"
                >
                  Mã OTP
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="otp"
                  value={OTP}
                  onChange={(e) => {
                    setOTP(e.target.value);
                    if (error.otp) setError({ ...error, otp: null });
                  }}
                  className={`w-full p-3 border rounded-xl text-center text-xl tracking-widest focus:outline-none focus:ring-2 ${
                    error.otp || error.otpApi
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-green-400"
                  }`}
                  placeholder="------"
                  maxLength={6} // Giả sử OTP 6 chữ số
                />
                {error.otp && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {error.otp}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r ${
              showOTP
                ? "from-green-600 to-teal-600 shadow-teal-500/30"
                : "from-blue-600 to-purple-600 shadow-blue-500/30"
            } text-white py-3 rounded-xl hover:opacity-95 transition duration-300 font-bold shadow-lg flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <RiLoader4Line className="animate-spin w-5 h-5" />{" "}
                {showOTP ? "Đang xác thực..." : "Đang đăng ký..."}
              </>
            ) : (
              <>
                <RiLoginCircleLine className="w-5 h-5" />{" "}
                {showOTP ? "Xác nhận OTP" : "Đăng ký"}
              </>
            )}
          </button>

          {/* Login link */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-gray-600">
            <p className="text-sm">
              Đã có tài khoản?{" "}
              <span
                className="cursor-pointer text-purple-600 hover:underline font-bold"
                onClick={() => navigate("/login")}
              >
                Đăng nhập ngay
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
