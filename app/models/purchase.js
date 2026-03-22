const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    purchaseId: {
      type: String,
      required: true,
      unique: true,
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supplier",
      required: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
        costPrice: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Completed",
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Purchase", purchaseSchema);
