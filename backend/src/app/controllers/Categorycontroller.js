const category = require("../models/Category");
const cloudinary = require("../../config/data/cloudinary");
class categoryController {
  async createCategory(req, res) {
    try {
      const { categoryTitle } = req.body;
      const categoryImage = req.file;
      if (!categoryTitle) {
        return res.status(400).json({ message: "Category title is required" });
      }
      if (!categoryImage) {
        return res.status(400).json({ message: "Category image is required" });
      }
      const existingCategory = await category.findOne({ categoryTitle });
      if (existingCategory) {
        return res.status(409).json({ message: "Category already exists" });
      }
      let uploadedCategoryImage;
      try {
        uploadedCategoryImage = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "banners" }, (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve({
                  publicId: result.public_id,
                  url: result.secure_url,
                });
              }
            })
            .end(categoryImage.buffer);
        });
      } catch (error) {
        console.error("Error uploading category image:", error);
        return res
          .status(500)
          .json({ message: "Error uploading category image" });
      }

      const newCategory = await category.create({
        categoryTitle,
        image: uploadedCategoryImage,
      });
      return res
        .status(201)
        .json({ message: "Category created successfully", data: newCategory });
    } catch (error) {
      console.error("Error creating category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllCategories(req, res) {
    try {
      const categories = await category.find();
      return res.status(200).json({
        message: "Categories retrieved successfully",
        data: categories,
      });
    } catch (error) {
      console.error("Error retrieving categories:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getCategoryById(req, res) {
    try {
      const { id } = req.params;
      const categoryData = await category.findById(id);
      if (!categoryData) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({
        message: "Category retrieved successfully",
        data: categoryData,
      });
    } catch (error) {
      console.error("Error retrieving category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { categoryTitle } = req.body;
      if (!categoryTitle) {
        return res.status(400).json({ message: "Category title is required" });
      }
      const updatedCategory = await category.findByIdAndUpdate(
        id,
        { categoryTitle },
        { new: true }
      );
      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      console.error("Error updating category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      const categoryImage = await category.findById(id);
      // Delete image from cloudinary
      if (categoryImage.image && categoryImage.image.publicId) {
        await cloudinary.uploader.destroy(categoryImage.image.publicId);
        console.log("Old image deleted from cloudinary");
      }
      const deletedCategory = await category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
module.exports = new categoryController();
