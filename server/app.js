require("dotenv").config();
const path = require("path");
const express = require("express"); // express tạo server nodejs
const mongoose = require("mongoose");
const cors = require("cors"); //middlewares cho phép gọi API trừ domain khác
require("dotenv").config(); // đọc enviroment variables từ env

const app = express(); // tạo express chính định nghĩa middlewares và rounter

//Middleware - Phần mềm trung gian
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//import routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes); //mọi route trong userRoutes sẽ được gắn thêm prefix /api/users

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected");
    app.listen(5000, () => {
      console.log("Port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
