const Product = require("../models/Product");
const Category = require("../models/Category");
const cloudinary = require("../../config/data/cloudinary");
const slugify = require("slugify");
class ProductController {
  // Create a new product
  async createProduct(req, res) {
    try {
      const { title, description, price, category, stock, city, discount } =
        req.body;
      const productImage = req.files;
      let productImageUploaded = [];
      try {
        productImageUploaded = await Promise.all(
          productImage.map((file) => {
            return new Promise((resolve, reject) => {
              cloudinary.uploader
                .upload_stream({ folder: "products" }, (error, result) => {
                  if (error) {
                    reject(error);
                  } else {
                    resolve({
                      publicId: result.public_id,
                      url: result.secure_url,
                    });
                  }
                })
                .end(file.buffer);
            });
          })
        );
      } catch (error) {
        console.error("Error uploading product images:", error);
        // handle the error appropriately (e.g., return a response or throw)
      }
      const images = await Promise.all(productImageUploaded);
      console.log(images);
      const product = await Product.create({
        title,
        description,
        price,
        category,
        image: images,
        stock,
        city,
        discount,
      });
      return res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something wrong when add product" });
    }
  }
  //update product
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const {
        title,
        description,
        price,
        category,
        stock,
        city,
        discount,
        existingImages,
      } = req.body;
      let newProductImage = req.files || [];
      console.log("New Product Images:", newProductImage);
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      // Get keep images from the product
      let keepImages = [];
      if (existingImages && existingImages.length > 0) {
        keepImages = JSON.parse(existingImages);
      }
      console.log("Keep Images:", existingImages);
      // get imges from need to delete
      const deleteImages = product.image.filter((oldImage) => {
        return !keepImages.some(
          (newImage) => newImage.publicId === oldImage.publicId
        );
      });
      // delete images from cloudinary
      for (let img of deleteImages) {
        await cloudinary.uploader.destroy(img.publicId);
      }
      // upload new images to cloudinary
      if (newProductImage.length > 0) {
        try {
          newProductImage = await Promise.all(
            newProductImage.map((file) => {
              return new Promise((resolve, reject) => {
                cloudinary.uploader
                  .upload_stream({ folder: "products" }, (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve({
                        publicId: result.public_id,
                        url: result.secure_url,
                      });
                    }
                  })
                  .end(file.buffer);
              });
            })
          );
        } catch (error) {
          console.error("Error uploading new product images:", error);
        }
      }

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
          title,
          description,
          price,
          category,
          image: [...keepImages, ...newProductImage],
          stock,
          city,
          discount,
        },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json({
        message: "Product updated successfully",
        data: updatedProduct,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something wrong when updating product" });
    }
  }
  // Delete product
  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      const deleteImages = product.image;
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      // Delete images from cloudinary
      for (let img of deleteImages) {
        await cloudinary.uploader.destroy(img.publicId);
      }
      await Product.findByIdAndDelete(productId);
      return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something wrong when deleting product" });
    }
  }
  // Get all products based on pagination
  async getAllProducts(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate("category", "categoryTitle");
      const totalProducts = await Product.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      return res.status(200).json({
        message: "Products retrieved successfully",
        data: {
          items: products,
          totalProducts,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something wrong when retrieving products" });
    }
  }
  // Get product by ID
  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId).populate(
        "category",
        "categoryTitle"
      );
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.status(200).json({
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something wrong when retrieving product" });
    }
  }
  // Get products by category
  async getProductsByCategory(req, res) {
    try {
      const { slug } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const decodedSlug = decodeURIComponent(slug);
      const slugged = slugify(decodedSlug, { lower: true, strict: true });

      const category = await Category.findOne({ slug: slugged });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      const products = await Product.find({ category: category._id })
        .populate("category")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      console.log(products, page, limit);
      const totalProducts = await Product.countDocuments({
        category: category._id,
      });
      const totalPages = Math.ceil(totalProducts / limit);

      if (products.length === 0) {
        return res
          .status(404)
          .json({ error: "No products found in this category" });
      }
      return res.status(200).json({
        message: "Products retrieved successfully",
        data: {
          products,
          totalProducts,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Something wrong when retrieving products" });
    }
  }
  // Get products by filter price and city
  async getProductsByFilter(req, res) {
    try {
      const { minPrice, maxPrice, city, slug } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const decodedSlug = decodeURIComponent(slug || "");
      const slugged = slugify(decodedSlug, { lower: true, strict: true });

      // Step 1: Find category by slug
      const category = await Category.findOne({ slug: slugged });
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Step 2: Build filter
      const filter = { category: category._id };
      if (minPrice && maxPrice) {
        filter.price = {
          $gte: parseFloat(minPrice),
          $lte: parseFloat(maxPrice),
        };
      }
      if (city) {
        filter.city = city;
      }

      const products = await Product.find(filter)
        .populate("category")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limit);
      if (products.length === 0) {
        return res
          .status(404)
          .json({ error: "Không tìm thấy sản phẩm nào với bộ lọc đã cho" });
      }

      return res.status(200).json({
        message: "Products retrieved successfully",
        data: {
          products,
          totalProducts,
          totalPages,
          currentPage: page,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Có lỗi khi truy xuất sản phẩm với bộ lọc đã cho",
      });
    }
  }
}
module.exports = new ProductController();
