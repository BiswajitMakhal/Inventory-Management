const userAuthController = require("../controllers/userAuthController");
const express = require("express");

const Router = express.Router();

Router.get("/login", userAuthController.loginView);
Router.get("/register", userAuthController.registerView);

Router.post("/login", userAuthController.loginUser);
Router.post("/register", userAuthController.registerUser);
Router.post("/logout", userAuthController.logout);

module.exports = Router;
