import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {
  const [error, setError] = React.useState({});
  const [form, setForm] = React.useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOTP, setShowOTP] = React.useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError({});
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    let newError = {};
    if (!form.otp) {
      newError.otp = "Mã OTP không được để trống";
    }
    if (!form.newPassword) {
      newError.newPassword = "Mật khẩu mới không được để trống";
    }
    if (form.newPassword !== form.confirmPassword) {
      newError.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    setError(newError);
    if (Object.keys(newError).length > 0) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/forgotPassword",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            otp: form.otp,
            newPassword: form.newPassword,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Lỗi kết nối server");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newError = {};
    if (!form.email) {
      newError.email = "Email không được để trống";
    }

    setError(newError);
    if (Object.keys(newError).length > 0) return;

    try {
      const res = await fetch("http://localhost:5000/api/users/checkEmail", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowOTP(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Lỗi kết nối server");
    }
  };
  return (
    <div>
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-200 to-purple-300 p-4">
        {!showOTP ? (
          <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl md:p-10">
            <h2 className="mb-2 text-center text-3xl font-bold text-gray-900">
              Quên mật khẩu?
            </h2>
            <p className="mb-8 text-center text-sm text-gray-600">
              Nhập email của bạn dưới đây, chúng tôi sẽ gửi cho bạn mã OTP để
              đặt lại mật khẩu.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onChange={handleChange}
                    value={form.email}
                    placeholder="a@example.com"
                    className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {error.email && (
                    <p className="mt-2 text-sm text-red-600">{error.email}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-500 to-purple-600 py-3 px-4 text-base font-semibold text-white shadow-sm transition duration-300 ease-in-out hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Gửi mã OTP
                </button>
              </div>
            </form>

            <div className="mt-1">
              <p className="text-sm text-gray-600">
                Đã nhớ mật khẩu?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                >
                  Quay lại Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleResetPassword}
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
              name="otp"
              value={form.otp}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mb-4 text-center"
              placeholder="Nhập mã OTP gồm 6 chữ số"
            />
            {error.otp && (
              <p className="mt-2 text-sm text-red-600 text-center">
                {error.otp}
              </p>
            )}
            <input
              type="password"
              name="newPassword"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Nhập mật khẩu mới"
            />
            {error.newPassword && (
              <p className="mt-2 text-sm text-red-600">{error.newPassword}</p>
            )}
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg mb-4"
              placeholder="Xác nhận mật khẩu mới"
            />
            {error.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {error.confirmPassword}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 rounded-lg hover:opacity-90 transition font-semibold shadow-md"
            >
              Đổi mặt khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPass;
