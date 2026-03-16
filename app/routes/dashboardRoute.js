const DashboardController = require("../controllers/dahboardController");
const express = require("express");
const { AuthCheck, isAdmin } = require("../middleware/authCheck");


const Router = express.Router();

Router.get("/dashboard",AuthCheck,isAdmin, DashboardController.getDashboard);

module.exports = Router;
