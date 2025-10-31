import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ====== Cấu hình cơ bản ======
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ====== Xử lý đường dẫn (vì dùng ES Modules) ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Middleware toàn cục ======
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Cấu hình thư mục public & upload ======
const publicPath = path.join(__dirname, "public");
const uploadPath = path.join(publicPath, "uploads");

// tạo static routes cho ảnh upload và public
app.use("/uploads", express.static(uploadPath));
app.use(express.static(publicPath));

// ====== Kết nối MongoDB ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Static assets (ảnh tour, avatar, v.v.) ======
app.use("/assets", express.static(path.join(__dirname, "assets")));

// ====== Import routes ======
import userRoutes from "./server/routes/userRoutes.js";
import tourRoutes from "./server/routes/tourRoutes.js";
// import bookingRoutes from "./server/routes/bookingRoutes.js";
// import providerRoutes from "./server/routes/providerRoutes.js";
// import invoiceRoutes from "./server/routes/invoiceRoutes.js";
// import reviewRoutes from "./server/routes/reviewRoutes.js";
// import destinationRoutes from "./server/routes/destinationRoutes.js";

// ====== Sử dụng routes ======
app.use("/api/users", userRoutes);
app.use("/api/tour", tourRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/providers", providerRoutes);
// app.use("/api/invoices", invoiceRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/destinations", destinationRoutes);

// ====== Phục vụ giao diện client ======
// Đường dẫn tới thư mục frontend (React/Vue hoặc HTML)
const clientPath = path.join(__dirname, "client", "public");

// nếu client nằm trong booking/client/public thì đoạn trên là đúng
app.use(express.static(clientPath));

// Khi truy cập "/", trả về index.html trong client/public
app.get("/", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// ====== Khởi chạy server ======
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
