const ProductController = require("../controllers/productController");
const productImage = require('../middleware/uploadMiddleware');

const express = require("express");
const Router = express.Router();



Router.post('/product/create',productImage.single('image'),ProductController.createProduct);
Router.get('/products',ProductController.getAllProduct);
Router.get('/product/new', ProductController.getAddProductPage);
Router.get('/product/edit/:id', ProductController.getEditProductPage);
Router.post('/product/update/:id',productImage.single('image'),ProductController.updateProduct);
Router.post("/product/delete/:id",ProductController.deleteProduct)


module.exports = Router;