const Order = require("../models/Order");
class OrderController {
  async createOrder(req, res) {
    try {
      const {
        userName,
        phoneNumber,
        city,
        address,
        note,
        cartItems,
        totalAmount,
        userId,
      } = req.body;
      console.log("Received order data:", req.body);

      const newOrder = await Order.create({
        userId,
        userName,
        phoneNumber,
        city,
        address,
        note,
        items: cartItems,
        totalAmount,
      });
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(500).json({
        error: "Lỗi máy chủ nội bộ",
        message: error.message,
      });
    }
  }
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .sort({ createdAt: -1 })
        .populate("userId", "email");
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.find({ userId: id })
        .sort({ createdAt: -1 })
        .populate("userId", "email");
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng của bạn" });
      }
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      console.error("Error retrieving order:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await Order.findById(orderId);
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy đơn hàng" });
      }
      order.status = status;
      await order.save();
      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đơn hàng thành công",
        order,
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "Lỗi máy chủ nội bộ" });
    }
  }
}
module.exports = new OrderController();
