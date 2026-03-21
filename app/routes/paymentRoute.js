const PaymentController = require("../controllers/paymentController");
const { AuthCheck, isAdmin } = require("../middleware/authCheck");

const express = require("express");
const Router = express.Router();


Router.post("/payments/create",AuthCheck,isAdmin,  PaymentController.addPayment);
Router.get("/payments",AuthCheck,isAdmin,  PaymentController.getAllPayment);
Router.get("/payments/pending",AuthCheck,isAdmin,  PaymentController.getPendingPayments);

module.exports = Router;
