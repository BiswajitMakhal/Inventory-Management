const categoryController = require('../controllers/categoryController');
const CategoryController = require('../controllers/categoryController');

const express = require('express');
const Router = express.Router();

Router.post('/category/create',CategoryController.createCategory);
Router.post('/category/update/:id',categoryController.updateCategory);
Router.get('/categories',CategoryController.getAllCategory);
Router.delete('/category/delete/:id',CategoryController.deleteCategory)

module.exports = Router;