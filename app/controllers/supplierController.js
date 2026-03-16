const Supplier = require("../models/supplier");
const statusCode = require("../helper/statusCode");

class SupplierController {
  async createSupplier(req, res) {
    try {
      const supplier = await Supplier.create(req.body);
      return res.redirect("/suppliers");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async getAllSupplier(req, res) {
    try {
      const suppliers = await Supplier.find();
      return res.render("admin/suppliers", { suppliers });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async deleteSupplier(req, res) {
    try {
      const id = req.params.id;
      await Supplier.findByIdAndDelete(id);
      return res.redirect("/suppliers");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async updateSupplier(req, res) {
    try {
      const id = req.params.id;
      const supplier = await Supplier.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.redirect("/suppliers");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new SupplierController();
