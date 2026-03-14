const Category = require("../models/category");
const Product = require("../models/product");
const statusCode = require("../helper/statusCode");

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name, description } = req.body;
      const existingCategory = await Category.findOne({ name: name });
      if (existingCategory) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: "category already exists",
        });
      }
      const category = await Category.create({
        name,
        description,
      });
      return res.status(statusCode.Ok).json({
        success: true,
        message: "category create successfully",
        data: category,
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async getAllCategory(req, res) {
    try {
      const category = await Category.find();
      return res.status(statusCode.Ok).json({
        suceess: true,
        message: "Category get successfully",
        data: category,
      });
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
      return res.status(statusCode.Ok).json({
        suceess: true,
        message: "delete category successfully",
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        suceess: false,
        message: err.message,
      });
    }
  }
}

module.exports = new CategoryController();
