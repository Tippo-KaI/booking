import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [OTP, setOTP] = useState("");
  const [showOTP, setShowOTP] = useState(false);

  const [error, setError] = useState({});
  const [form, setForm] = useState({
    hoTen: "",
    ngaySinh: "",
    gioiTinh: "",
    diaChi: "",
    dienThoai: "",
    email: "",
    tenDangNhap: "",
    matKhau: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newError = {};
    if (!form.hoTen) newError.HoTen = "Họ tên là bắt buộc";
    if (!form.ngaySinh) newError.NgaySinh = "Ngày sinh là bắt buộc";
    if (!form.email) newError.Email = "Email là bắt buộc";
    if (!form.tenDangNhap) newError.TenDangNhap = "Tên đăng nhập là bắt buộc";
    if (!form.matKhau) newError.MatKhau = "Mật khẩu là bắt buộc";
    if (form.matKhau !== form.confirmPassword) {
      newError.confirmPassword = "Mật khẩu không khớp";
    }

    setError(newError);
    if (Object.keys(newError).length > 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Response: ", data);

      if (res.ok) {
        setShowOTP(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!OTP) return alert("Vui lòng nhập mã OTP");

    try {
      const res = await fetch("http://localhost:5000/api/users/verifyOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: OTP, formData: form }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Xác thực thành công! Tài khoản đã được tạo.");
        navigate("/login");
      } else {
        alert(data.message || "Mã OTP không đúng hoặc đã hết hạn");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối server");
    }
  };

  return (
    <div>
      <header className="bg-white shadow-md top-0 left-0 z-50 h-16 w-full flex items-center px-16">
        <div className="container flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 cursor-pointer"
          >
            Booki
          </Link>
        </div>
      </header>

      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
        {!showOTP ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-2xl shadow-lg w-lg border border-gray-100 my-10"
          >
            <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Đăng ký
            </h2>

            {/* Họ tên */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hoTen"
                value={form.hoTen}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập họ tên..."
              />
              {error.HoTen && (
                <p className="text-red-500 text-sm">{error.HoTen}</p>
              )}
            </div>

            {/* Ngày sinh */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="ngaySinh"
                value={form.ngaySinh}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              {error.NgaySinh && (
                <p className="text-red-500 text-sm">{error.NgaySinh}</p>
              )}
            </div>

            {/* Giới tính */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Giới tính <span className="text-red-500">*</span>
              </label>
              <select
                name="gioiTinh"
                value={form.gioiTinh}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">-- Chọn --</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            {/* Địa chỉ */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Địa chỉ</label>
              <input
                type="text"
                name="diaChi"
                value={form.diaChi}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập địa chỉ..."
              />
            </div>

            {/* Điện thoại */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="dienThoai"
                value={form.dienThoai}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập số điện thoại..."
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập email..."
              />
              {error.Email && (
                <p className="text-red-500 text-sm">{error.Email}</p>
              )}
            </div>

            {/* Tên đăng nhập */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Tên đăng nhập</label>
              <input
                type="text"
                name="tenDangNhap"
                value={form.tenDangNhap}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập tên đăng nhập..."
              />
              {error.TenDangNhap && (
                <p className="text-red-500 text-sm">{error.TenDangNhap}</p>
              )}
            </div>

            {/* Mật khẩu */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="matKhau"
                value={form.matKhau}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập mật khẩu..."
              />
              {error.MatKhau && (
                <p className="text-red-500 text-sm">{error.MatKhau}</p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div className="mb-6">
              <label className="block mb-1 font-medium">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
                placeholder="Nhập lại mật khẩu..."
              />
              {error.confirmPassword && (
                <p className="text-red-500 text-sm">{error.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md"
            >
              Đăng ký
            </button>

            {/* Link Login */}
            <p className="text-center mt-4 text-gray-600">
              Đã có tài khoản?{" "}
              <span
                onClick={() => navigate("/Login")}
                className="cursor-pointer text-blue-500 hover:underline font-medium ml-1"
              >
                Đăng nhập
              </span>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOTP}
            className="bg-white p-8 rounded-2xl shadow-lg w-md border border-gray-100 my-10"
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
              Nhập mã OTP
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Mã xác thực đã được gửi đến <b>{form.email}</b>
            </p>
            <input
              type="text"
              value={OTP}
              onChange={(e) => setOTP(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 text-center"
              placeholder="Nhập mã OTP gồm 6 chữ số"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md"
            >
              Xác nhận OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
