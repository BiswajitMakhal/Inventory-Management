const SupplierController = require('../controllers/supplierController');

const express = require('express');

const Router = express.Router();

Router.post('/supplier/create',SupplierController.createSupplier);
Router.get('/suppliers',SupplierController.getAllSupplier);
Router.post('/supplier/update/:id',SupplierController.updateSupplier);
Router.delete ('/supplier/delete/:id',SupplierController.deleteSupplier);

module.exports = Router;