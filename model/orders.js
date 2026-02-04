const mongoose = require("./connection.js")

// create order model schema
const orderSchema = new mongoose.Schema({
  _id: ObjectId,
  orderNumber: String, // unique, indexed
  userId: ObjectId, // 'User', indexed
  
  items: [
    {
      _id: ObjectId,
      productId: ObjectId, // 'Product'
      variantId: ObjectId,
      name: String,
      sku: String,
      image: String,
      price: Number,
      quantity: Number,
      tax: Number,
      subtotal: Number,
      total: Number
    }
  ],
  
  // Pricing
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  discount: Number,
  total: Number,
  
  // Status
  status: String, // 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  paymentStatus: String, // 'pending', 'paid', 'failed', 'refunded'
  fulfillmentStatus: String, //'unfulfilled', 'partial', 'fulfilled'
  
  // Shipping
  shippingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  
  // Billing
  billingAddress: {
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  
  shippingMethod: String,
  trackingNumber: String,
  carrier: String,
  estimatedDelivery: Date,
  shippedAt: Date,
  deliveredAt: Date,
  
  // Payment
  paymentMethod: String,
  paymentId: ObjectId, // 'Payment'
  
  notes: String,
  customerNotes: String,
  couponCode: String,
  refundAmount: Number,
  refundReason: String,
  cancelledAt: Date,
  cancellationReason: String,
  
  createdAt: Date,
  updatedAt: Date
})

// create Address model
const Order = mongoose.model("Order", orderSchema)

// export Address model
module.exports = Order