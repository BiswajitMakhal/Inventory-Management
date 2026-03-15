const OrderController = require('../controllers/orderController');

const express = require('express');

const Router= express.Router();

Router.post('/order/create',OrderController.createOrder);
Router.get('/orders',OrderController.getAllOrder);
Router.post('/order/cancel',OrderController.cancelOrder)

module.exports = Router;