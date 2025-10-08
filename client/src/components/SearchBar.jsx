import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ onSearch, placeholder = "Tìm kiếm..." }) => {
  const [query, setQuery] = useState("");

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  // const handleUploadClick = () => {
  //   // Kiểm tra thông tin người dùng (có thể từ localStorage hoặc API)
  //   const hasUserInfo = localStorage.getItem("userInfoFilled");
  //   if (hasUserInfo) {
  //     navigate("/upload"); // sang trang đăng tải
  //   } else {
  //     navigate("/userinfo"); // sang trang điền thông tin
  //   }
  // };

  return (
    <div>
      <form onSubmit={handleSearch} className="flex justify-center my-4 gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 rounded-l px-4 py-2 w-2/3 focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tìm
        </button>
        <button
          type="button"
          onClick={() => navigate("/userinfo")}
          className="bg-yellow-300 text-white px-4 py-2 rounded hover:bg-yellow-400"
        >
          Đăng tải
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
