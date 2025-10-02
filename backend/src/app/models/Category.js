const mongoose = require("mongoose");
const slugify = require("slugify");
const categorySchema = new mongoose.Schema(
  {
    categoryTitle: { type: String, required: true },
    image: {
      publicId: String,
      url: String,
    },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);
categorySchema.pre("save", function (next) {
  if (this.isModified("categoryTitle")) {
    this.slug = slugify(this.categoryTitle, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("categories", categorySchema);
