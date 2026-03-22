const PurchaseController = require("../controllers/purchaseController");
const { AuthCheck, isAdmin } = require("../middleware/authCheck");
const express = require("express");
const Router = express.Router();

Router.get("/purchases", AuthCheck, isAdmin, PurchaseController.getAllPurchases);
Router.get("/purchase/new", AuthCheck, isAdmin, PurchaseController.getAddPurchasePage);
Router.post("/purchase/create", AuthCheck, isAdmin, PurchaseController.createPurchase);

module.exports = Router;