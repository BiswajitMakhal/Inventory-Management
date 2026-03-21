const SupplierController = require('../controllers/supplierController');

const express = require('express');
const { AuthCheck, isAdmin } = require("../middleware/authCheck");

const Router = express.Router();

Router.post('/supplier/create',AuthCheck,isAdmin, SupplierController.createSupplier);
Router.get('/suppliers',AuthCheck,isAdmin, SupplierController.getAllSupplier);
Router.post('/supplier/update/:id',AuthCheck,isAdmin, SupplierController.updateSupplier);
Router.post ('/supplier/delete/:id',AuthCheck,isAdmin, SupplierController.deleteSupplier);

module.exports = Router;