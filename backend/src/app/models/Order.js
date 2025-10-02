const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    userName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String, default: "" },
    items: [],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Đang chờ", "Đang xử lý", "Đã hoàn thành"],
      default: "Đang chờ",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("orders", orderSchema);
