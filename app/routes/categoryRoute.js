const CategoryController = require("../controllers/categoryController");

const express = require("express");
const Router = express.Router();
const { AuthCheck, isAdmin } = require("../middleware/authCheck");


Router.post("/category/create",AuthCheck,isAdmin, CategoryController.createCategory);
Router.post("/category/update/:id",AuthCheck,isAdmin,  CategoryController.updateCategory);
Router.get("/category/edit/:id",AuthCheck,isAdmin,  CategoryController.getEditCategoryPage);
Router.get("/categories",AuthCheck,isAdmin,  CategoryController.getAllCategory);
Router.post("/category/delete/:id",AuthCheck,isAdmin,  CategoryController.deleteCategory);

module.exports = Router;
