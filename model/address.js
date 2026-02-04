const mongoose = require("./connection.js")

// create Address model schema
const addressSchema = new mongoose.Schema(
{
  _id: ObjectId,
  userId: ObjectId, // 'User', indexed
  fullName: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  isDefault: Boolean,
  addressType: String, // 'home', 'work', 'other'
  createdAt: Date,
  updatedAt: Date
})

// create Address model
const Address = mongoose.model("Adress", addressSchema)

// export Address model
module.exports = Address