const Category = require("../models/category");
const Product = require("../models/product");
const statusCode = require("../helper/statusCode");

class CategoryController {
  async getEditCategoryPage(req, res) {
    try {
      const id = req.params.id;
      const category = await Category.findById(id);
      if (!category) {
        return res.redirect("/categories");
      }
      return res.render("admin/editCategory", { category });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      const existingCategory = await Category.findOne({ name: name });
      if (existingCategory) {
        return res.redirect("/categories");
      }
      const category = await Category.create({
        name,
        description,
      });
      return res.redirect("/categories");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async getAllCategory(req, res) {
    try {
      const categories = await Category.find();
      return res.render("admin/categories", { categories });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        suceess: false,
        message: err.message,
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const id = req.params.id;
      const linkedProduct = await Product.findOne({ categoryId: id });
      if (linkedProduct) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "already product is included , not delete",
        });
      }
      await Category.findByIdAndDelete(id);
      return res.redirect("/categories");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        suceess: false,
        message: err.message,
      });
    }
  }
  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const category = await Category.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.redirect("/categories");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new CategoryController();
