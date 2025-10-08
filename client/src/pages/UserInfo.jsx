import React, { useState } from "react";
import Header from "../components/Header";
import { Camera, Edit3, Save } from "lucide-react";

const UserInfo = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    HoTen: "",
    NgaySinh: "",
    GioiTinh: "",
    DiaChi: "",
    DienThoai: "",
    Email: "",
    TenDangNhap: "",
    NgayDangKy: "",
    CCCD: "",
    NgayCap: "",
    NoiCap: "",
    SoTaiKhoanNganHang: "",
    TenNganHang: "",
    CCCDTruoc: null,
    CCCDSau: null,
    Avatar: null,
  });

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setUser({ ...user, [field]: file });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* --- SIDEBAR --- */}
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
          <div className="relative">
            <img
              src={
                user.Avatar
                  ? URL.createObjectURL(user.Avatar) // Hien thi anh local tu may
                  : ""
              }
              alt=""
              className="w-32 h-32 rounded-full object-cover shadow border"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer hover:bg-blue-600">
                <Camera className="text-white w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, "Avatar")}
                />
              </label>
            )}
          </div>

          <h2 className="text-xl font-semibold mt-4">{user.HoTen}</h2>
          <p className="text-gray-500 text-sm mt-1">{user.Email}</p>
          <p className="text-gray-500 text-sm">{user.DienThoai}</p>

          <button
            onClick={() => setEditing(!editing)}
            className={`mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white font-medium ${
              editing
                ? "bg-green-400 hover:bg-green-500"
                : "bg-blue-400 hover:bg-blue-500"
            }`}
          >
            {editing ? (
              <Save className="w-4 h-4" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}
            {editing ? "Lưu thay đổi" : "Chỉnh sửa thông tin"}
          </button>

          <div className="mt-6 w-full border-t pt-4 text-sm text-gray-500">
            <p>Thành viên từ: {user.NgayDangKy}</p>
            <p className="mt-1">Tên đăng nhập: {user.TenDangNhap}</p>
          </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="col-span-2 bg-white rounded-2xl shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* --- THÔNG TIN CÁ NHÂN --- */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Họ tên", name: "HoTen", type: "text" },
                  { label: "Ngày sinh", name: "NgaySinh", type: "date" },
                  { label: "Giới tính", name: "GioiTinh", type: "select" },
                  { label: "Địa chỉ", name: "DiaChi", type: "text" },
                  { label: "Số điện thoại", name: "DienThoai", type: "text" },
                  { label: "Email", name: "Email", type: "email" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-700 text-sm mb-1">
                      {field.label}
                    </label>
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={user[field.name]}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`w-full border rounded px-3 py-2 ${
                          !editing && "bg-gray-100 cursor-not-allowed" //${!editing && "bg-gray-100 cursor-not-allowed"} thêm class động
                        }`}
                      >
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={user[field.name]}
                        onChange={handleChange}
                        disabled={!editing}
                        className={`w-full border rounded px-3 py-2 ${
                          !editing && "bg-gray-100 cursor-not-allowed" //${!editing && "bg-gray-100 cursor-not-allowed"} thêm class động
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* --- THÔNG TIN NHÀ CUNG CẤP --- */}
            <div>
              <h3 className="text-lg font-semibold border-b pb-2 mb-4 text-gray-700">
                Thông tin nhà cung cấp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Số CCCD", name: "CCCD" },
                  { label: "Ngày cấp", name: "NgayCap", type: "date" },
                  { label: "Nơi cấp", name: "NoiCap" },
                  {
                    label: "Số tài khoản ngân hàng",
                    name: "SoTaiKhoanNganHang",
                  },
                  { label: "Tên ngân hàng", name: "TenNganHang" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-gray-700 text-sm mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={user[field.name]}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full border rounded px-3 py-2 ${
                        !editing && "bg-gray-100 cursor-not-allowed"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Ảnh CCCD mặt trước
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "CCCDTruoc")}
                  disabled={!editing}
                  className="w-full border rounded px-3 py-2"
                />
                {user.HinhAnhCCCD && (
                  <img
                    src={URL.createObjectURL(user.HinhAnhCCCD)}
                    alt="CCCD"
                    className="mt-3 w-64 rounded-xl shadow"
                  />
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 text-sm mb-1">
                  Ảnh CCCD mặt sau
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "CCCDSau")}
                  disabled={!editing}
                  className="w-full border rounded px-3 py-2"
                />
                {user.HinhAnhCCCD && (
                  <img
                    src={URL.createObjectURL(user.HinhAnhCCCD)}
                    alt="CCCD"
                    className="mt-3 w-64 rounded-xl shadow"
                  />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
