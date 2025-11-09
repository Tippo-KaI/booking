import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import Header from "../components/Header";

const AddTour = () => {
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    itinerary: "",
    price: "",
    duration: "",
    location: "",
    departureDate: "",
    slots: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tour mới:", form);
    alert("Đã thêm tour thành công!");
  };

  return (
    <div>
      <Header />
      <DashboardLayout>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Đăng Tải Tour Mới</h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-xl p-6 space-y-5 max-w-3xl"
        >
          {/* Tên tour */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Tour
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên tour..."
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          {/* Ảnh */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link ảnh (URL)
            </label>
            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            />
          </div>

          {/* Mô tả ngắn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả ngắn
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="2"
              placeholder="Mô tả ngắn gọn về tour..."
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          {/* Lịch trình */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lịch trình chi tiết
            </label>
            <textarea
              name="itinerary"
              value={form.itinerary}
              onChange={handleChange}
              rows="4"
              placeholder="Nhập lịch trình của tour..."
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          {/* Giá, Số ngày, Địa điểm */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VND)
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ví dụ: 2500000"
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số ngày / đêm
              </label>
              <input
                type="text"
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="3 ngày 2 đêm"
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa điểm
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Đà Lạt, Nha Trang..."
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Ngày khởi hành & Số lượng chỗ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày khởi hành
              </label>
              <input
                type="date"
                name="departureDate"
                value={form.departureDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng chỗ
              </label>
              <input
                type="number"
                name="slots"
                value={form.slots}
                onChange={handleChange}
                placeholder="20"
                className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
              />
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="2"
              placeholder="Thông tin thêm (nếu có)..."
              className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
            ></textarea>
          </div>

          {/* Nút submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Đăng tour
            </button>
          </div>
        </form>
      </DashboardLayout>
    </div>
  );
};

export default AddTour;
