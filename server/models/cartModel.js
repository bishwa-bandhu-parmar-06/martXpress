import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    // Snapshot fields (important for performance)
    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
      default: 1,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
      unique: true, // One cart per user
    },

    items: {
      type: [cartItemSchema],
      validate: [
        (val) => val.length <= 50,
        "Cart cannot contain more than 50 items",
      ],
    },

    totalQuantity: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["active", "ordered", "abandoned"],
      default: "active",
    },

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: { expires: "7d" }, // Auto delete abandoned cart
    },
  },
  {
    timestamps: true,
  },
);

/*
Automatically recalculate totals before saving
*/
cartSchema.pre("save", function (next) {
  this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);

  this.totalPrice = this.items.reduce((sum, item) => sum + item.subtotal, 0);

  next();
});

/*
 Compound index for faster lookup
*/
cartSchema.index({ userId: 1, "items.productId": 1 });

const Cart = mongoose.model("cart", cartSchema);
export default Cart;
