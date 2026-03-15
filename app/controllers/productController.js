const Product = require("../models/product");
const statusCode = require("../helper/statusCode");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadCloudinary");

class ProductController {
  async createProduct(req, res) {
    try {
      const {
        name,
        sku,
        categoryId,
        supplierId,
        price,
        stockQuantity,
        minStockLevel,
        status,
      } = req.body;
      let imageUrl = "";
      let imagePublicId = "";

      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      }
      const product = await Product.create({
        name,
        sku,
        categoryId,
        supplierId,
        price,
        stockQuantity,
        minStockLevel,
        status,
        imageUrl,
        imagePublicId,
      });
      return res.status(statusCode.Ok).json({
        success: true,
        message: "product created",
        data: product,
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      const {
        name,
        sku,
        categoryId,
        supplierId,
        price,
        stockQuantity,
        minStockLevel,
        status,
      } = req.body;
      let product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
      let imageUrl = product.secure_url;
      let imagePublicId = product.public_id;

      if (req.file) {
        if (product.imagePublicId) {
          await cloudinary.uploader.destroy(product.imagePublicId);
        }
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
      }
      product = await Product.findByIdAndUpdate(
        id,
        {
          name,
          sku,
          categoryId,
          supplierId,
          price,
          stockQuantity,
          minStockLevel,
          status,
          imageUrl,
          imagePublicId,
        },
        { new: true },
      );

      return res.status(statusCode.Ok).json({
        success: true,
        message: "Product updated successfully",
        data: product,
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
      if (!product) {
        return res.status(statusCode.NOT_FOUND).json({
          success: false,
          message: "product not found",
        });
      }
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      await Product.findByIdAndDelete(id);
      return res.status(statusCode.Ok).json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }

  async getAllProduct(req, res) {
    try {
      const product = await Product.find()
        .populate("categoryId", "name")
        .populate("supplierId", "name");
      return res.status(statusCode.Ok).json({
        success: true,
        product,
      });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
}

module.exports = new ProductController();
