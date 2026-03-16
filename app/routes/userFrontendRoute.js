const userFrontendController = require("../controllers/userFrontendController");
const express = require("express");
const Router = express.Router();
const { AuthCheck,isUser } = require("../middleware/authCheck");

Router.get("/home", AuthCheck, isUser, userFrontendController.getHomePage);
Router.get("/cart", AuthCheck, isUser, userFrontendController.getCartPage);
Router.get("/orders", AuthCheck, isUser, userFrontendController.getUserOrders);

Router.post("/cart/add", AuthCheck, isUser, userFrontendController.addToCart);
Router.post("/cart/remove/:id", AuthCheck, isUser, userFrontendController.removeFromCart);
Router.post("/checkout", AuthCheck, isUser, userFrontendController.checkout);

module.exports = Router;
