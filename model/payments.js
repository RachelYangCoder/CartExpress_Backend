const mongoose = require("mongoose");

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    userId:  { type: Schema.Types.ObjectId, ref: "User",  required: true, index: true },
    amount:  { type: Number, required: true },
    currency:{ type: String, default: "usd", uppercase: true },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "debit_card", "paypal", "stripe", "apple_pay", "google_pay"],
      required: true,
    },
    paymentGateway:  { type: String, default: "stripe" },
    // Stripe IDs
    stripePaymentIntentId: { type: String, unique: true, sparse: true, index: true },
    stripeChargeId:        { type: String },
    transactionId:         { type: String, unique: true, sparse: true, index: true },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded", "partially_refunded"],
      default: "pending",
      index: true,
    },
    // Masked card details (never store full card numbers)
    paymentDetails: {
      cardLast4:    { type: String },
      cardBrand:    { type: String },
      cardExpMonth: { type: Number },
      cardExpYear:  { type: Number },
    },
    refundAmount:        { type: Number, default: 0 },
    refundTransactionId: { type: String },
    refundedAt:          { type: Date },
    failureReason:       { type: String },
    metadata:            { type: Map, of: String },
    paidAt:              { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);