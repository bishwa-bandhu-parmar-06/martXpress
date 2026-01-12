import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../config/constants.js";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: {
        values: PRODUCT_CATEGORIES,
        message: "{VALUE} is not a valid category",
      },
    },
    brand: { type: String },

    price: { type: Number, required: true, min: 1 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    finalPrice: { type: Number, default: 0 },

    stock: { type: Number, default: 0, min: 0 },

    images: [{ type: String }],

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "seller",
      required: true,
    },

    averageRating: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },

    tags: [{ type: String }],

    status: {
      type: String,
      enum: ["active", "inactive", "out of stock"],
      default: "active",
    },

    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ⭐ Auto-calc finalPrice on save
productSchema.pre("save", function (next) {
  this.finalPrice =
    this.discount > 0
      ? this.price - (this.price * this.discount) / 100
      : this.price;
  next();
});

// ⭐ Auto-calc finalPrice on update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price || update.discount) {
    const price = update.price ?? this._update.price;
    const discount = update.discount ?? this._update.discount ?? 0;
    update.finalPrice = price - (price * discount) / 100;
  }
  next();
});

// ----------------------
// 🔥 High Performance Indexes
// ----------------------

productSchema.index({ createdAt: -1 });

productSchema.index({ sellerId: 1, createdAt: -1 });

productSchema.index({ featured: 1, status: 1, createdAt: -1 });

productSchema.index({ category: 1 });

productSchema.index({ brand: 1 });

productSchema.index({ averageRating: -1 });

productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
  tags: "text",
});

const Product = mongoose.model("product", productSchema);
export default Product;
