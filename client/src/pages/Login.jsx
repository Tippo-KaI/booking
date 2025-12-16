import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Import icons
import {
  RiMailLine,
  RiLockLine,
  RiLoginCircleLine,
  RiKey2Line,
  RiLoader4Line,
} from "react-icons/ri";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error[name]) {
      setError({ ...error, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let newError = {};
    if (!form.email) newError.email = "Vui lòng nhập Email";
    if (!form.password) newError.password = "Vui lòng nhập Mật khẩu";

    setError(newError);
    if (Object.keys(newError).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        const userRole = data.user.role;

        if (userRole === "admin") navigate("/admin/manage-tours");
        else navigate("/dashboard");
      } else {
        setError({ api: data.message || "Đăng nhập thất bại" });
      }
    } catch (err) {
      console.error(err);
      setError({ api: "Lỗi kết nối server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header (Giữ nguyên cấu trúc) */}
      <header className="bg-white shadow-lg fixed top-0 left-0 z-50 h-16 w-full flex items-center border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-extrabold text-slate-800">
              <span className="text-blue-600">Booki</span>Travel
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to={"/register"}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
              >
                Đăng ký
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

      {/* Form Area */}
      <div className="flex items-center justify-center min-h-screen pt-16">
        <form
          onSubmit={handleSubmit}
          // Form style tối ưu
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 transform transition duration-300 hover:shadow-3xl"
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center text-slate-800">
            Chào mừng trở lại!
          </h2>

          {/* API Error Message */}
          {error.api && (
            <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-300 text-red-700 font-medium text-center shadow-sm">
              {error.api}
            </div>
          )}

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 font-semibold text-gray-700 text-sm"
            >
              <RiMailLine className="inline-block mr-2 w-4 h-4 text-blue-500" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              // Input style tối ưu
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

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-1 font-semibold text-gray-700 text-sm"
            >
              <RiLockLine className="inline-block mr-2 w-4 h-4 text-purple-500" />
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              // Input style tối ưu
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

          {/* Quên mật khẩu link */}
          <div className="text-right mb-6">
            <Link
              to={"/forgotpass"}
              className="text-sm text-purple-600 hover:underline font-medium"
            >
              <RiKey2Line className="inline-block mr-1 w-4 h-4 relative -top-0.5" />{" "}
              Quên mật khẩu?
            </Link>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:opacity-95 transition duration-300 font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <RiLoader4Line className="animate-spin w-5 h-5" /> Đang đăng
                nhập...
              </>
            ) : (
              <>
                <RiLoginCircleLine className="w-5 h-5" /> Đăng nhập
              </>
            )}
          </button>

          {/* Register link */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-gray-600">
            <p className="text-sm">
              Chưa có tài khoản?
              <span
                className="cursor-pointer text-purple-600 hover:underline font-bold ml-1"
                onClick={() => navigate("/register")}
              >
                Đăng ký ngay
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
