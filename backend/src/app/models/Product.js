const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    city: { type: String, required: true },
    discount: { type: Number, required: true },
    image: [
      {
        publicId: String,
        url: String,
      },
    ],
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("products", productSchema);
