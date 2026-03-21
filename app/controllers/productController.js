const Product = require("../models/product");
const statusCode = require("../helper/statusCode");
const cloudinary = require("../config/cloudinary");
const uploadToCloudinary = require("../utils/uploadCloudinary");
const { Parser } = require('json2csv'); 
// addproducts
const Category = require("../models/category");
const Supplier = require("../models/supplier");

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
      return res.redirect("/products");
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async getEditProductPage(req, res) {
    try {
      const id = req.params.id;
      const product = await Product.findById(id);
      if (!product) {
        return res.redirect("/products");
      }
      const categories = await Category.find();
      const suppliers = await Supplier.find();
      return res.render("admin/editProduct", {
        product,
        categories,
        suppliers,
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
      let imageUrl = product.imageUrl;
      let imagePublicId = product.imagePublicId;

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

      return res.redirect("/products");
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
      return res.redirect("/products");
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
      return res.render("admin/products", { product });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async getAddProductPage(req, res) {
    try {
      const categories = await Category.find();
      const suppliers = await Supplier.find();
      return res.render("admin/addProduct", { categories, suppliers });
    } catch (err) {
      return res.status(statusCode.SERVER_ERROR).json({
        success: false,
        message: err.message,
      });
    }
  }
  async exportProductsCSV(req, res) {
    try {
      const products = await Product.find()
        .populate("categoryId", "name")
        .populate("supplierId", "name");

      
      const csvData = products.map((p) => ({
        "SKU": p.sku,
        "Product Name": p.name,
        "Category": p.categoryId ? p.categoryId.name : "N/A",
        "Supplier": p.supplierId ? p.supplierId.name : "N/A",
        "Price (Rs)": p.price,
        "Stock Quantity": p.stockQuantity,
        "Status": p.status
      }));

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(csvData);

      res.header("Content-Type", "text/csv");
      res.attachment("Products_Inventory_Report.csv");
      
      return res.send(csv);

    } catch (err) {
      console.log(err);
      return res.redirect("/products");
    }
  }
}

module.exports = new ProductController();
