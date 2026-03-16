const PaymentController = require("../controllers/paymentController");
const express = require("express");
const Router = express.Router();

Router.post("/payments/create", PaymentController.addPayment);
Router.get("/payments", PaymentController.getAllPayment);
Router.get("/payments/pending", PaymentController.getPendingPayments);

module.exports = Router;
