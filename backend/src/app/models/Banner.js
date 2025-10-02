const mongoose = require("mongoose");
const bannerSchema = new mongoose.Schema(
  {
    image: {
      publicId: String,
      url: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("banners", bannerSchema);
