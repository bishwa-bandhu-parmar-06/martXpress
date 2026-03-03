import mongoose from "mongoose";
import { PRODUCT_CATEGORIES } from "../config/constants.js";

import { esClient } from "../config/elasticsearch.js";

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
  { timestamps: true },
);

// Auto-calc finalPrice on save
productSchema.pre("save", function (next) {
  this.finalPrice =
    this.discount > 0
      ? this.price - (this.price * this.discount) / 100
      : this.price;
  next();
});

// Auto-calc finalPrice on update
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
// High Performance Indexes (MongoDB)
// ----------------------
productSchema.index({ createdAt: -1 });
productSchema.index({ sellerId: 1, createdAt: -1 });
productSchema.index({ featured: 1, status: 1, createdAt: -1 });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ averageRating: -1 });

// We keep the Mongo text index as a fallback just in case ES is ever down
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
  tags: "text",
});

// ==========================================
// ELASTICSEARCH AUTOMATIC SYNC HOOKS
// ==========================================

// Helper function to format data for Elasticsearch
const formatForES = (doc) => ({
  name: doc.name,
  description: doc.description,
  brand: doc.brand,
  category: doc.category,
  tags: doc.tags,
  price: doc.price,
  finalPrice: doc.finalPrice,
  images: doc.images,
  status: doc.status,
  averageRating: doc.averageRating,
  featured: doc.featured,
});

// 1. Sync on CREATE
productSchema.post("save", async function (doc) {
  try {
    if (esClient) {
      await esClient.index({
        index: "products",
        id: doc._id.toString(), // Keep MongoDB ID and ES ID identical
        body: formatForES(doc),
      });
      console.log(`[Elasticsearch] Synced new product: ${doc._id}`);
    }
  } catch (err) {
    console.error("[Elasticsearch] Failed to sync on save:", err.message);
  }
});

// 2. Sync on UPDATE
productSchema.post("findOneAndUpdate", async function (doc) {
  // 'doc' is the updated document because we use { new: true } in our controllers usually
  if (doc) {
    try {
      if (esClient) {
        await esClient.index({
          index: "products",
          id: doc._id.toString(),
          body: formatForES(doc),
        });
        console.log(`[Elasticsearch] Updated product: ${doc._id}`);
      }
    } catch (err) {
      console.error("[Elasticsearch] Failed to sync on update:", err.message);
    }
  }
});

// 3. Sync on DELETE
productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      if (esClient) {
        await esClient.delete({
          index: "products",
          id: doc._id.toString(),
        });
        console.log(`[Elasticsearch] Deleted product: ${doc._id}`);
      }
    } catch (err) {
      // Ignore 404 errors (meaning it was already deleted or never existed in ES)
      if (err.meta && err.meta.statusCode === 404) return;
      console.error("[Elasticsearch] Failed to delete:", err.message);
    }
  }
});

const Product = mongoose.model("product", productSchema);
export default Product;
