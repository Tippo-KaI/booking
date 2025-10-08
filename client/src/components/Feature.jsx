import React from "react";

const Feature = () => {
  const items = [
    {
      icon: "💳",
      title: "Giá tốt nhất",
      desc: "Luôn cung cấp giá cạnh tranh và nhiều ưu đãi hấp dẫn.",
    },
    {
      icon: "⚡",
      title: "Đặt chỗ nhanh chóng",
      desc: "Thao tác đơn giản, hoàn tất đặt chỗ chỉ trong vài phút.",
    },
    {
      icon: (
        <img
          width="48"
          height="48"
          src="https://img.icons8.com/doodle/48/vietnam--v1.png"
          alt="vietnam--v1"
          className="m-auto"
        />
      ),
      title: "Nhiều điểm đến",
      desc: "Khám phá hàng nghìn địa điểm hấp dẫn trên khắp Việt Nam.",
    },
  ];

  return (
    <section className="container mx-auto py-16 px-6">
      <div className="grid md:grid-cols-3 gap-8 text-center">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition"
          >
            <div className="text-blue-600 text-4xl mb-4">{item.icon}</div>
            <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Feature;
