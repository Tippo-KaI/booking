import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  hoTen: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true },
  ngayDangKy: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
