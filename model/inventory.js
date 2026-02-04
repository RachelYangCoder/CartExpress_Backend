const mongoose = require("./connection.js")

// create Address model schema
const inventorySchema = new mongoose.Schema({
  _id: ObjectId,
  productId: ObjectId, // ref: 'Product', indexed
  variantId: ObjectId,
  type: String, // 'sale', 'restock', 'adjustment', 'return', 'damage'
  quantity: Number,
  previousStock: Number,
  newStock: Number,
  orderId: ObjectId, // ref: 'Order'
  reason: String,
  performedBy: ObjectId, // ref: 'User'
  createdAt: Date
})

// create Address model
const Inventory = mongoose.model("Inventory", inventorySchema)

// export Address model
module.exports = Inventory