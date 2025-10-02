const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema(
  {
    commentText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comments", commentSchema);
