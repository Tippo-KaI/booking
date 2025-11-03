import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    tenTour: { type: String, required: true },
    diaDiem: { type: String, required: true },
    gia: { type: Number, required: true },
    soNgay: { type: Number, required: true },
    moTa: { type: String },
    ngayKhoiHanh: { type: Date, required: true },
    hinhAnh: { type: String },

    // 🔽 Các trường mở rộng
    soLuongKhachToiDa: { type: Number, required: true },
    soLuongDaDangKy: { type: Number, default: 0 },

    // 🥗 Ăn uống: chỉ Buffet hoặc Tự túc
    anUong: { type: String, enum: ["Set menu", "Tự túc", "Buffet"], default: "Set menu", },

    khuVucThamQuan: { type: String, required: true },

    daDay: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("tour", tourSchema);
