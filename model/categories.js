const mongoose = require("./connection.js")

// create Address model schema
const categloriesSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String, // unique, indexed
  slug: String, // unique, indexed
  description: String,
  image: String,
  parentCategoryId: ObjectId, // ref: 'Category', indexed
  isActive: Boolean,
  sortOrder: Number,
  metaTitle: String,
  metaDescription: String,
  createdAt: Date,
  updatedAt: Date
})

// create Address model
const Categlories = mongoose.model("Categlories", categloriesSchema)

// export Address model
module.exports = Categlories
