const mongoose = require("./connection.js")

// create Address model schema
const reviewSchema = new mongoose.Schema({
  _id: ObjectId,
  productId: ObjectId, // ref: 'Product', indexed
  userId: ObjectId, // ref: 'User', indexed
  orderId: ObjectId, // ref: 'Order'
  rating: Number, // 1-5, indexed
  title: String,
  comment: String,
  images: [String],
  isVerifiedPurchase: Boolean,
  isApproved: Boolean, // indexed
  helpfulCount: Number,
  reportCount: Number,
  createdAt: Date,
  updatedAt: Date
})

// Indexes
db.reviews.createIndex({ productId: 1 })
db.reviews.createIndex({ userId: 1 })
db.reviews.createIndex({ rating: 1 })
db.reviews.createIndex({ isApproved: 1 })
db.reviews.createIndex({ createdAt: -1 })
db.reviews.createIndex({ productId: 1, userId: 1, orderId: 1 }, { unique: true })

// create Address model
const Review = mongoose.model("Review", reviewSchema)

// export Address model
module.exports = Review