const ProductController = require("../controllers/productController");
const productImage = require('../middleware/uploadMiddleware');
const { AuthCheck, isAdmin } = require("../middleware/authCheck");

const express = require("express");
const Router = express.Router();



Router.post('/product/create',AuthCheck,isAdmin, productImage.single('image'),ProductController.createProduct);
Router.get('/products',AuthCheck,isAdmin, ProductController.getAllProduct);
Router.get('/product/new',AuthCheck,isAdmin,  ProductController.getAddProductPage);
Router.get('/product/edit/:id',AuthCheck,isAdmin,  ProductController.getEditProductPage);
Router.post('/product/update/:id',AuthCheck,isAdmin, productImage.single('image'),ProductController.updateProduct);
Router.post("/product/delete/:id",AuthCheck,isAdmin, ProductController.deleteProduct);
Router.get('/products/export/csv',AuthCheck,isAdmin,  ProductController.exportProductsCSV);


module.exports = Router;