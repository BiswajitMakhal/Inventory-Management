const ProductController = require("../controllers/productController");
const productImage = require('../middleware/uploadMiddleware');

const express = require("express");
const Router = express.Router();



Router.post('/product/create',productImage.single('image'),ProductController.createProduct);
Router.get('/products',ProductController.getAllProduct);
Router.post('/product/update/:id',productImage.single('image'),ProductController.updateProduct);
Router.delete("/product/delete/:id",ProductController.deleteProduct)


module.exports = Router;