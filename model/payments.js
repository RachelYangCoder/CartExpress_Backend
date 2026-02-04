const mongoose = require("./connection.js")

// create payment model schema
const paymentSchema = new mongoose.Schema({
  _id: ObjectId,
  orderId: ObjectId, // ref: 'Order', indexed
  userId: ObjectId, // ref: 'User', indexed
  amount: Number,
  currency: String,
  paymentMethod: String, // enum: 'credit_card', 'debit_card', 'paypal', 'stripe', etc.
  paymentGateway: String,
  transactionId: String, // unique, indexed
  paymentIntentId: String,
  status: String, // enum: 'pending', 'processing', 'completed', 'failed', 'refunded'
  
  paymentDetails: {
    cardLast4: String,
    cardBrand: String,
    cardExpMonth: Number,
    cardExpYear: Number
  },
  
  refundAmount: Number,
  refundTransactionId: String,
  refundedAt: Date,
  failureReason: String,
  metadata: Object,
  paidAt: Date,
  createdAt: Date,
  updatedAt: Date
})

// Indexes
db.payments.createIndex({ orderId: 1 })
db.payments.createIndex({ userId: 1 })
db.payments.createIndex({ transactionId: 1 }, { unique: true })
db.payments.createIndex({ status: 1 })
db.payments.createIndex({ createdAt: -1 })

// create Address model
const Payment = mongoose.model("Payment", paymentSchema)

// export Address model
module.exports = Payment