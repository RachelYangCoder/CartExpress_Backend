const mongoose = require("mongoose");

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description:     { type: String },
    image:           { type: String },
    parentCategoryId:{
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    isActive:        { type: Boolean, default: true, index: true },
    sortOrder:       { type: Number, default: 0 },
    metaTitle:       { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
