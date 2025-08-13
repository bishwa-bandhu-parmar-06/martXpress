const mongoose = require( "mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  /*//Product name:
// Men's Cotton Printed T-Shirt
// ➡️ Slug banega:
// mens-cotton-printed-tshirt */
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  finalPrice: {
    type: Number,
  },
  category: {
    type: String,
    ref: "Category",
    required: true,
  },
  brand: {
    type: String,
  },
  stock: {
    type: Number,
    default: 0,
  },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  ratings: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
