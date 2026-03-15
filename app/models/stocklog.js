const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stockSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  type: {
    type: String,
    enum: ["In", "Out", "Adjustment"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reason: String,
});

const stockModel = mongoose.model("stock", stockSchema);

module.exports = stockModel;
