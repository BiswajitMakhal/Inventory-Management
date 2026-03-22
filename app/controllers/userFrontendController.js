const Product = require("../models/product");
const Order = require("../models/order");
const Payment = require("../models/payment");
const crypto = require("crypto");

class UserFrontendController {
  async getHomePage(req, res) {
    try {
      const products = await Product.find({ status: "Active" }).populate(
        "categoryId",
      );
      return res.render("user/home", { products });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async getCartPage(req, res) {
    try {
      const cartItems = req.session.cart || [];
      const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );

      return res.render("user/cart", { cartItems, cartTotal });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const product = await Product.findById(productId);

      if (!product) return res.status(404).send("Product not found");

      if (!req.session.cart) {
        req.session.cart = [];
      }

      const existingItemIndex = req.session.cart.findIndex(
        (item) => item.productId === productId,
      );

      if (existingItemIndex > -1) {
        req.session.cart[existingItemIndex].quantity += Number(quantity);
      } else {
        req.session.cart.push({
          productId: product._id.toString(),
          productName: product.name,
          price: product.price,
          quantity: Number(quantity),
        });
      }

      return res.redirect("/user/cart");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async removeFromCart(req, res) {
    try {
      const { id } = req.params;
      if (req.session.cart) {
        req.session.cart = req.session.cart.filter(
          (item) => item.productId !== id,
        );
      }
      return res.redirect("/user/cart");
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const orders = await Order.find({ userId: userId }).sort({
        createdAt: -1,
      });

      return res.render("user/orders", { orders });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  }

 async checkout(req, res) {
    try {
      if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect("/user/cart");
      }

      const userId = req.user.id;
      const cartItems = req.session.cart;
      let totalAmount = 0;
      let productsForOrder = [];

      for (let item of cartItems) {
        totalAmount += item.price * item.quantity;
        productsForOrder.push({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stockQuantity: -item.quantity },
        });
      }

      const orderId =
        "ORD-" + crypto.randomBytes(4).toString("hex").toUpperCase();

      const newOrder = await Order.create({
        orderId,
        userId,
        products: productsForOrder,
        totalAmount,
        status: "Pending", 
      });

     
      await Payment.create({
        orderId: newOrder._id, 
        totalAmount: totalAmount,
        paidAmount: 0,
        dueAmount: totalAmount, 
        status: "Unpaid", 
        paymentMethod: "Cash", 
      });

      req.session.cart = [];

      return res.redirect("/user/orders");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Error processing checkout: " + err.message);
    }
  }
}

module.exports = new UserFrontendController();
