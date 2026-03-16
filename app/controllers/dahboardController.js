const Category = require("../models/category");
const Product = require("../models/product");
const Supplier = require("../models/supplier");
const Order = require("../models/order");
const statusCode = require("../helper/statusCode");

class DashboardController {
  async getDashboard(req, res) {
    try {
      const totalProducts = await Product.countDocuments();
      const totalCategories = await Category.countDocuments();
      const totalSuppliers = await Supplier.countDocuments();
      const lowStockProducts = await Product.find({
        $expr: {
          $lte: ["$stockQuantity", "$minStockLevel"],
        },
      }).countDocuments();
      const completedOrders = await Order.find({ status: "Completed" });
      const totalSalesRevenue = completedOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );

      const latestProducts = await Product.find()
        .populate("categoryId")
        .limit(5);

      return res.render("admin/dashboard", {
        totalProducts,
        totalCategories,
        totalSuppliers,
        lowStockProducts,
        totalSalesRevenue,
        latestProducts,
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new DashboardController();
