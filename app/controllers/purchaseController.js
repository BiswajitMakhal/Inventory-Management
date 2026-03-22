const Purchase = require("../models/purchase");
const Supplier = require("../models/supplier");
const Product = require("../models/product");
const StockLog = require("../models/stocklog");
const crypto = require("crypto");
const statusCode = require("../helper/statusCode");

class PurchaseController {
    // 1. Sob Purchase List Dekhanor jonno
    async getAllPurchases(req, res) {
        try {
            const purchases = await Purchase.find()
                .populate("supplierId", "name contactPerson")
                .sort({ createdAt: -1 });
            return res.render("admin/purchases", { purchases });
        } catch (err) {
            return res.status(statusCode.SERVER_ERROR).send(err.message);
        }
    }

    // 2. Notun Mal Kenar Page
    async getAddPurchasePage(req, res) {
        try {
            const suppliers = await Supplier.find();
            const products = await Product.find({ status: "Active" });
            return res.render("admin/addPurchase", { suppliers, products });
        } catch (err) {
            return res.status(statusCode.SERVER_ERROR).send(err.message);
        }
    }

    // 3. Form Submit Hole Stock Baranor Logic (Stock In)
    async createPurchase(req, res) {
        try {
            const { supplierId, productId, quantity, costPrice } = req.body;
            
            // UI theke single product asbe dhore nilam
            let productsArr = [{
                productId: productId,
                quantity: Number(quantity),
                costPrice: Number(costPrice)
            }];
            
            let totalAmount = Number(quantity) * Number(costPrice);
            const purchaseId = "PUR-" + crypto.randomBytes(4).toString("hex").toUpperCase();

            // Purchase Record Toiri kora
            const purchase = await Purchase.create({
                purchaseId,
                supplierId,
                products: productsArr,
                totalAmount
            });

            // 🔥 ASOL KAJ: Stock Barano ar Log rakha 🔥
            await Product.findByIdAndUpdate(productId, {
                $inc: { stockQuantity: Number(quantity) } // Stock IN hocche
            });

            await StockLog.create({
                productId: productId,
                type: "In", // System bujhbe mal dhuklo
                quantity: Number(quantity),
                reason: `Stock purchased from Supplier. ID: ${purchaseId}`
            });

            return res.redirect("/purchases");
        } catch (err) {
            console.log(err);
            return res.status(statusCode.SERVER_ERROR).send("Error adding purchase: " + err.message);
        }
    }
}

module.exports = new PurchaseController();