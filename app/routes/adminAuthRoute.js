const adminAuthController = require('../controllers/adminAuthController');
const express = require('express');

const Router = express.Router();

Router.post('/login',adminAuthController.loginAdmin);


module.exports = Router;