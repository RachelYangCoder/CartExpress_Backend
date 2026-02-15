const mongoose = require("mongoose");

const { Schema } = mongoose;

const inventorySchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    variantId:  { type: Schema.Types.ObjectId },
    type: {
      type: String,
      enum: ["sale", "restock", "adjustment", "return", "damage"],
      required: true,
      index: true,
    },
    quantity:      { type: Number, required: true }, // can be negative (e.g. sale)
    previousStock: { type: Number, required: true },
    newStock:      { type: Number, required: true },
    orderId:       { type: Schema.Types.ObjectId, ref: "Order" },
    reason:        { type: String },
    performedBy:   { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Note: inventory log is append-only — no updates, only inserts
module.exports = mongoose.model("InventoryLog", inventorySchema);