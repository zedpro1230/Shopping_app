const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, default: "" },
    googleId: { type: String, unique: true, sparse: true },
    avatar: { type: String, default: "" },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("users", userSchema);
