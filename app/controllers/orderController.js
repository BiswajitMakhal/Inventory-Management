const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const StockLog = require("../models/stocklog");
const crypto = require("crypto");
const statusCode = require("../helper/statusCode");

class OrderController {
  async getAddOrderPage(req, res) {
    try {
      const users = await User.find({ role: "User" });
      const products = await Product.find({
        status: "Active",
        stockQuantity: { $gt: 0 },
      });

      return res.render("admin/addOrder", { users, products });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async createOrder(req, res) {
    try {
      const { userId, products } = req.body;
      let totalAmount = 0;
      for (let item of products) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(statusCode.Ok).json({
            success: false,
            message: "Product not found",
          });
        }
        if (product.stockQuantity < item.quantity) {
          return res.status(statusCode.BAD_REQUEST).json({
            success: false,
            message: "insufficient stock",
          });
        }
        item.price = product.price;
        totalAmount += product.price * item.quantity;
      }
      const orderId =
        "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

      const order = await Order.create({
        orderId,
        userId,
        products,
        totalAmount,
        status: "Completed",
      });

      for (let item of products) {
        const product = await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity },
        });
        await StockLog.create({
          productId: item.productId,
          type: "Out",
          quantity: item.quantity,
          reason: `Sold in Order ${orderId}`,
        });
      }
      return res.redirect("/orders");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: true,
        message: err.message,
      });
    }
  }

  async getAllOrder(req, res) {
    try {
      const orders = await Order.find()
        .populate("userId", "name email")
        .populate("products.productId", "name");
      return res.render("admin/sales", { orders });
    } catch (error) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
  async cancelOrder(req, res) {
    try {
      const id = req.params.id;
      const order = await Order.findById(id);

      if (!order)
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "Order not found",
        });
      if (order.status === "Cancelled")
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "Order is already cancelled",
        });

      for (let item of order.products) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: item.quantity },
        });

        await StockLog.create({
          productId: item.productId,
          type: "In",
          quantity: item.quantity,
          reason: `Order Cancelled - Order ID: ${order.orderId}`,
        });
      }

      order.status = "Cancelled";
      await order.save();

      return res.redirect("/orders");
    } catch (error) {
      res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  }
}

module.exports = new OrderController();
