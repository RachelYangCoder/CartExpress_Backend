const mongoose = require("./connection.js")

// create Address model schema
const categloriesSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  slug: String, 
  description: String,
  shortDescription: String,
  sku: String,
  price: Number,
  comparePrice: Number,
  costPrice: Number,
  categoryId: ObjectId, 
  images: [String], // array of URLs
  thumbnail: String,
  stockQuantity: Number,
  lowStockThreshold: Number,
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String
  },
  isFeatured: Boolean, // indexed
  isActive: Boolean, // indexed
  tags: [String], // text indexed
  variants: [
    {
      _id: ObjectId,
      name: String,
      sku: String,
      price: Number,
      stockQuantity: Number,
      attributes: Object,
      image: String,
      isActive: Boolean
    }
  ],
  specifications: Object,
  metaTitle: String,
  metaDescription: String,
  metaKeywords: String,
  averageRating: Number,
  totalReviews: Number,
  totalSales: Number,
  createdAt: Date,
  updatedAt: Date
})

// Indexes
db.products.createIndex({ slug: 1 }, { unique: true })
db.products.createIndex({ sku: 1 }, { unique: true })
db.products.createIndex({ categoryId: 1 })
db.products.createIndex({ isActive: 1 })
db.products.createIndex({ isFeatured: 1 })
db.products.createIndex({ price: 1 })
db.products.createIndex({ createdAt: -1 })
db.products.createIndex({ name: "text", description: "text", tags: "text" })

// create Address model
const Categlories = mongoose.model("Categlories", categloriesSchema)

// export Address model
module.exports = Categlories