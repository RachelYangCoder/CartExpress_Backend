const mongoose = require("mongoose");

const { Schema } = mongoose;

const addressSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fullName:     { type: String, required: true },
    phone:        { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city:         { type: String, required: true },
    state:        { type: String, required: true },
    postalCode:   { type: String, required: true },
    country:      { type: String, required: true, default: "Canada" },
    isDefault:    { type: Boolean, default: false },
    addressType:  {
      type: String,
      enum: ["home", "work", "other"],
      default: "home",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);