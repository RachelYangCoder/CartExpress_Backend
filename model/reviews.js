const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    userId:    { type: Schema.Types.ObjectId, ref: "User",    required: true, index: true },
    orderId:   { type: Schema.Types.ObjectId, ref: "Order",   required: true },
    rating:    { type: Number, required: true, min: 1, max: 5, index: true },
    title:     { type: String, trim: true },
    comment:   { type: String, trim: true },
    images:    [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    isApproved:         { type: Boolean, default: false, index: true },
    helpfulCount:       { type: Number, default: 0 },
    reportCount:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per user per product per order
reviewSchema.index({ productId: 1, userId: 1, orderId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);