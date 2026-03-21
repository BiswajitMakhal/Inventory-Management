const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const StockLog = require("../models/stocklog");
const Payment = require("../models/payment");
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

      await Payment.create({
        orderId: order._id,
        totalAmount: order.totalAmount,
        paidAmount: 0,
        dueAmount: order.totalAmount,
        status: "Unpaid",
        paymentMethod: "Cash",
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
      const searchQuery = req.query.search || "";
      let queryFilter = {};

      if (searchQuery) {
        queryFilter = {
          orderId: { $regex: searchQuery, $options: "i" },
        };
      }

      const orders = await Order.find(queryFilter)
        .sort({ createdAt: -1 })
        .populate("userId", "name email")
        .populate("products.productId", "name");

      return res.render("admin/sales", { orders, search: searchQuery });
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
  async markAsPaid(req, res) {
    try {
      const orderId = req.params.id;

      await Payment.findOneAndUpdate(
        { orderId: orderId },
        {
          status: "Paid",
          paidAmount: req.body.totalAmount,
          dueAmount: 0,
        },
      );

      await Order.findByIdAndUpdate(orderId, { status: "Completed" });

      return res.redirect("/orders");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Payment Update Failed");
    }
  }
}

module.exports = new OrderController();
