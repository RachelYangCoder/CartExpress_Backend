const mongoose = require("mongoose");

const { Schema } = mongoose;

const variantSchema = new Schema({
  name:          { type: String, required: true },
  sku:           { type: String, required: true },
  price:         { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, default: 0, min: 0 },
  attributes:    { type: Map, of: String }, // e.g. { color: "red", size: "M" }
  image:         { type: String },
  isActive:      { type: Boolean, default: true },
});

const productSchema = new Schema(
  {
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, lowercase: true, index: true },
    description:      { type: String },
    shortDescription: { type: String },
    sku:              { type: String, required: true, unique: true, index: true },
    price:            { type: Number, required: true, min: 0, index: true },
    comparePrice:     { type: Number, min: 0 }, // original/crossed-out price
    costPrice:        { type: Number, min: 0 }, // internal cost
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    images:           [{ type: String }],
    thumbnail:        { type: String },
    stockQuantity:    { type: Number, default: 0, min: 0 },
    lowStockThreshold:{ type: Number, default: 5 },
    weight:           { type: Number },
    dimensions: {
      length: { type: Number },
      width:  { type: Number },
      height: { type: Number },
      unit:   { type: String, enum: ["cm", "in"], default: "cm" },
    },
    isFeatured:      { type: Boolean, default: false, index: true },
    isActive:        { type: Boolean, default: true, index: true },
    tags:            [{ type: String }],
    variants:        [variantSchema],
    specifications:  { type: Map, of: String },
    metaTitle:       { type: String },
    metaDescription: { type: String },
    metaKeywords:    { type: String },
    averageRating:   { type: Number, default: 0, min: 0, max: 5 },
    totalReviews:    { type: Number, default: 0 },
    totalSales:      { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Text index for search
productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
