const CategoryController = require("../controllers/categoryController");

const express = require("express");
const Router = express.Router();

Router.post("/category/create", CategoryController.createCategory);
Router.post("/category/update/:id", CategoryController.updateCategory);
Router.get("/category/edit/:id", CategoryController.getEditCategoryPage);
Router.get("/categories", CategoryController.getAllCategory);
Router.post("/category/delete/:id", CategoryController.deleteCategory);

module.exports = Router;
