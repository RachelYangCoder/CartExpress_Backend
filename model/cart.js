const mongoose = require("mongoose");

const { Schema } = mongoose;

const cartItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variantId:  { type: Schema.Types.ObjectId },
  name:       { type: String, required: true },
  sku:        { type: String },
  image:      { type: String },
  price:      { type: Number, required: true, min: 0 },
  quantity:   { type: Number, required: true, min: 1 },
  subtotal:   { type: Number, required: true, min: 0 },
});

const cartSchema = new Schema(
  {
    // For logged-in users
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true, default: null },
    // For guest users
    sessionId: { type: String, index: true, default: null },
    items:     [cartItemSchema],
    subtotal:  { type: Number, default: 0 },
    tax:       { type: Number, default: 0 },
    discount:  { type: Number, default: 0 },
    total:     { type: Number, default: 0 },
    couponCode:{ type: String },
    expiresAt: { type: Date, index: true },
  },
  { timestamps: true }
);

// TTL index — MongoDB auto-deletes expired guest carts
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Auto-recalculate totals before save
cartSchema.pre("save", function (next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.total = this.subtotal + this.tax - this.discount;
  next();
});

module.exports = mongoose.model("Cart", cartSchema);