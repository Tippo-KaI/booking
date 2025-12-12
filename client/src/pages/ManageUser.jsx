import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
// Import icons
import {
  RiUser3Line,
  RiMailLine,
  RiLoader4Line,
  RiAdminLine,
  RiTeamLine,
  RiCalendarCheckLine,
} from "react-icons/ri";

const API_USERS = "http://localhost:5000/api/users";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Hàm định dạng ngày tham gia
  const formatJoinDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ===========================================================
  // 1. Fetch danh sách người dùng
  // ===========================================================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_USERS);
      const data = await res.json();

      if (res.ok) {
        const sortedUsers = (data || []).sort((a, b) =>
          a.role === "admin" ? -1 : 1
        );

        setUsers(sortedUsers);
      } else {
        setMessage(
          `❌ Lỗi tải dữ liệu: ${
            data.message || "Không thể tải danh sách người dùng."
          }`
        );
      }
    } catch (error) {
      setMessage("❌ Lỗi kết nối Server khi tải Người dùng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Loại bỏ hàm handleDelete vì không còn nút Xóa

  // ====================== RENDER UI =======================
  if (loading)
    return (
      <AdminLayout>
        <p className="text-blue-600 font-semibold text-lg flex items-center gap-2">
          <RiLoader4Line className="animate-spin" /> Đang tải danh sách Người
          dùng...
        </p>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <RiUser3Line className="text-blue-600 w-7 h-7" /> Quản Lý Người dùng
        </h2>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-xl mb-6 shadow-md border 
                        ${
                          message.startsWith("✅")
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-red-50 text-red-700 border-red-300"
                        }`}
        >
          {message.startsWith("✅") || message.startsWith("❌")
            ? message
            : `ℹ️ ${message}`}
        </div>
      )}

      {/* Bảng danh sách */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Thông tin cơ bản
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Vai trò (Role)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Ngày tham gia
              </th>
              {/* ĐÃ XOÁ CỘT "THAO TÁC" */}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-100">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <p className="font-semibold text-slate-800">
                      {user.hoTen || "N/A"}
                    </p>
                    <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <RiMailLine className="w-3 h-3" /> {user.email}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {user.role === "admin" ? (
                      <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-xs">
                        <RiAdminLine /> ADMIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium text-xs">
                        <RiTeamLine /> Khách hàng
                      </span>
                    )}
                  </td>

                  {/* CỘT NGÀY THAM GIA */}
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    <span className="flex items-center gap-1">
                      <RiCalendarCheckLine className="w-4 h-4 text-green-500" />
                      {formatJoinDate(user.ngayDangKy)}
                    </span>
                  </td>

                  {/* ĐÃ XOÁ CỘT "THAO TÁC" */}
                </tr>
              ))
            ) : (
              <tr>
                {/* Cập nhật colSpan từ 4 thành 3 */}
                <td
                  colSpan="3"
                  className="px-6 py-8 text-center text-gray-500 font-medium text-base"
                >
                  <RiUser3Line className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  Chưa có dữ liệu người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
