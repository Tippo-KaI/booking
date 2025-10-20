import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import DashboardLayout from "../components/DashboardLayout";

const AddTour = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.price <= 0) return alert("Giá tour phải lớn hơn 0!");

    try {
      const response = await fetch("http://localhost:5000/api/tours", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert("Đăng tải tour thành công!");
      setFormData({
        name: "",
        description: "",
        location: "",
        price: "",
        image: "",
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Đăng tour thất bại, vui lòng kiểm tra lại!");
    }
  };

  return (
    <div>
      <Header />
      <DashboardLayout>
        <h2 className="text-2xl font-bold mb-6">Đăng tải Tour mới</h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Tên tour
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên tour..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mô tả..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Địa điểm
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa điểm..."
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Giá (VND)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập giá tour..."
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-1">
              Link ảnh (URL)
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Dán link ảnh..."
            />
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đăng tải
          </button>
        </form>
      </DashboardLayout>
    </div>
  );
};

export default AddTour;
