require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Cho phép truy cập ảnh upload
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================================
// ROUTES
// ================================

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

const tourRoutes = require("./routes/tourRoutes");
app.use("/api/tours", tourRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/bookings", bookingRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/admin/invoices", invoiceRoutes);

const eventRoutes = require("./routes/eventRoutes");
app.use("/api/admin/events", eventRoutes);

const hotelRoutes = require("./routes/hotelRoutes");
app.use("/api/admin/hotels", hotelRoutes);

const uploadRoutes = require("./routes/upload");
app.use("/api/upload", uploadRoutes);

// ================================
// DATABASE + SERVER
// ================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("Server chạy tại port 5000");
    });
  })
  .catch((err) => console.log(err));
