import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newError = {};
    if (!form.email) newError.email = "Email is required";
    if (!form.password) newError.password = "Password is required";
    setError(newError);
    if (Object.keys(newError).length > 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        // sau khi login thành công => lưu token (nếu có)
        localStorage.setItem("token", data.token);
        navigate("/DashBoard");
      } else {
        alert(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-white shadow-md fixed top-0 left-0 z-50 h-16 w-full flex items-center px-16">
        <div className="container flex justify-between items-center">
          <div>
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 cursor-pointer"
            >
              Booki
            </Link>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg w-96 border border-gray-100"
        >
          <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Đăng nhập
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-1 font-medium text-gray-700"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Nhập email"
            />
            {error.email && (
              <p className="text-red-500 text-sm mt-1">{error.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-1 font-medium text-gray-700"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Nhập mật khẩu..."
            />
            {error.password && (
              <p className="text-red-500 text-sm mt-1">{error.password}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition duration-200 cursor-pointer font-semibold shadow-md"
          >
            Đăng nhập
          </button>

          <div>
            <Link
              to={"/forgotpass"}
              className="text-sm text-blue-500 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Register link */}
          <div className="mt-4 text-center text-gray-600">
            <p>
              Chưa có tài khoản?{" "}
              <span
                className="cursor-pointer text-blue-500 hover:underline font-medium"
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
