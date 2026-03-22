const Payment = require("../models/payment");
const Order = require("../models/order");
const statusCode = require("../helper/statusCode");

class PaymentController {
  async addPayment(req, res) {
    try {
      const { orderId, amountPaid, paymentMethod } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "order not found",
        });
      }

      let payment = await Payment.findOne({ orderId });
      if (!payment) {
        payment = new Payment({
          orderId,
          totalAmount: order.totalAmount,
          paidAmount: 0,
          dueAmount: order.totalAmount,
          paymentMethod,
        });
      }

      payment.paidAmount += Number(amountPaid);
      payment.dueAmount = payment.totalAmount - payment.paidAmount;

      if (payment.dueAmount <= 0) {
        payment.status = "Paid";
        payment.dueAmount = 0;

        await Order.findByIdAndUpdate(orderId, { status: "Completed" });
      } else if (payment.paidAmount > 0) {
        payment.status = "Partial";
      }

      await payment.save();

      return res.redirect("/payments");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getAllPayment(req, res) {
    try {
      const payments = await Payment.find()
        .populate({
          path: "orderId",
          populate: { path: "userId", select: "name" },
        })
        .sort({ createdAt: -1 });

      return res.render("admin/payments", { payments });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async getPendingPayments(req, res) {
    try {
      const pendingPayments = await Payment.find({
        status: { $in: ["Unpaid", "Partial"] },
      }).populate("orderId", "orderId user");
      return res.render("admin/payments", { payments: pendingPayments });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new PaymentController();
