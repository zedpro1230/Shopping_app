const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

// Route to create a new order
router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:orderId/status", orderController.updateOrderStatus);

module.exports = router;
