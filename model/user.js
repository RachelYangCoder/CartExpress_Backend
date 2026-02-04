const mongoose = require("./connection.js")

// create User model schema
const userSchema = new mongoose.Schema(
    {
  _id: ObjectId,
  email: String, 
  password: String,
  firstName: String,
  lastName: String,
  phone: String,
  role: String, // 'customer', 'admin', 'vendor'
  isEmailVerified: Boolean, 
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  avatar: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
})

// Indexes
db.inventoryLogs.createIndex({ productId: 1 })
db.inventoryLogs.createIndex({ type: 1 })
db.inventoryLogs.createIndex({ createdAt: -1 })

// create User model
const User = mongoose.model("User", userSchema)

// export User model
module.exports = User