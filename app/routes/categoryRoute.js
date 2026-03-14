const CategoryController = require('../controllers/categoryController');

const express = require('express');
const Router = express.Router();

Router.post('/create/category',CategoryController.createCategory);
Router.get('/categories',CategoryController.getAllCategory);
Router.delete('/category/delete/:id',CategoryController.deleteCategory)

module.exports = Router;