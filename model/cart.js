const mongoose = require("./connection.js")

// create Address model schema
const cartSchema = new mongoose.Schema(
{
  _id: ObjectId,
  userId: ObjectId, // ref: 'User', indexed (nullable)
  sessionId: String, // indexed (for guest users)
  items: [
    {
      _id: ObjectId,
      productId: ObjectId, // ref: 'Product'
      variantId: ObjectId,
      name: String,
      sku: String,
      image: String,
      price: Number,
      quantity: Number,
      subtotal: Number
    }
  ],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  couponCode: String,
  expiresAt: Date, // indexed
  createdAt: Date,
  updatedAt: Date
})
// Indexes
db.carts.createIndex({ userId: 1 })
db.carts.createIndex({ sessionId: 1 })
db.carts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }) // TTL index

// create Address model
const Cart = mongoose.model("Cart", cartSchema)

// export Address model
module.exports = Cart