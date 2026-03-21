const OrderController = require('../controllers/orderController');
const { AuthCheck, isAdmin } = require("../middleware/authCheck");


const express = require('express');

const Router= express.Router();



Router.post('/order/create',AuthCheck,isAdmin, OrderController.createOrder);
Router.get('/orders',AuthCheck,isAdmin, OrderController.getAllOrder);
Router.get('/orders/new',AuthCheck,isAdmin,  OrderController.getAddOrderPage);
Router.post('/order/cancel/:id',AuthCheck,isAdmin,  OrderController.cancelOrder);

module.exports = Router;