const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSnapshotSchema = new Schema({
  fullName:     String,
  phone:        String,
  addressLine1: String,
  addressLine2: String,
  city:         String,
  state:        String,
  postalCode:   String,
  country:      String,
}, { _id: false });

const orderItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: "Product" },
  variantId:  { type: Schema.Types.ObjectId },
  name:       { type: String, required: true },
  sku:        { type: String },
  image:      { type: String },
  price:      { type: Number, required: true },
  quantity:   { type: Number, required: true, min: 1 },
  tax:        { type: Number, default: 0 },
  subtotal:   { type: Number, required: true },
  total:      { type: Number, required: true },
});

const orderSchema = new Schema(
  {
    orderNumber: { type: String, unique: true, index: true },
    userId:      { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items:       [orderItemSchema],

    // Pricing
    subtotal:     { type: Number, required: true },
    tax:          { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    discount:     { type: Number, default: 0 },
    total:        { type: Number, required: true },

    // Status
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    fulfillmentStatus: {
      type: String,
      enum: ["unfulfilled", "partial", "fulfilled"],
      default: "unfulfilled",
    },

    // Addresses (snapshot at time of order)
    shippingAddress: addressSnapshotSchema,
    billingAddress:  addressSnapshotSchema,

    // Shipping
    shippingMethod:   { type: String },
    trackingNumber:   { type: String },
    carrier:          { type: String },
    estimatedDelivery:{ type: Date },
    shippedAt:        { type: Date },
    deliveredAt:      { type: Date },

    // Payment
    paymentMethod: { type: String },
    paymentId:     { type: Schema.Types.ObjectId, ref: "Payment" },

    // Notes
    notes:              { type: String },
    customerNotes:      { type: String },
    couponCode:         { type: String },
    refundAmount:       { type: Number },
    refundReason:       { type: String },
    cancelledAt:        { type: Date },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

// Auto-generate order number before saving new order
orderSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  const count = await mongoose.model("Order").countDocuments();
  this.orderNumber = `CE-${String(count + 1).padStart(6, "0")}`;
  next();
});

module.exports = mongoose.model("Order", orderSchema);
