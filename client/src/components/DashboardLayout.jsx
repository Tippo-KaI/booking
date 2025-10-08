import React from "react";
import SearchBar from "./SearchBar";

const DashboardLayout = ({ placeholder, onSearch, children }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <SearchBar placeholder={placeholder} onSearch={onSearch} />

      <div className="mt-6 p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
