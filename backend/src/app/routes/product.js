const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const productController = require("../controllers/ProductController");

// Route to create a new product
router.post("/", upload.array("image", 5), productController.createProduct);
router.get("/", productController.getAllProducts);
router.get("/search/:search", productController.searchProducts);
router.get("/category/:slug", productController.getProductsByCategory);
router.get("/filter", productController.getProductsByFilter);
router.get("/:id", productController.getProductById);
router.put("/:id", upload.array("image", 5), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
