import React from "react";

const DashboardLayout = ({ placeholder, onSearch, children }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mt-6 p-6">{children}</div>
    </div>
  );
};

export default DashboardLayout;
