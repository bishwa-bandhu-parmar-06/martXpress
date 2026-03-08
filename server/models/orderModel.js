import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        sellerId: {
          // ADDED: Makes querying orders for a specific seller 100x faster
          type: mongoose.Schema.Types.ObjectId,
          ref: "seller",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        itemStatus: {
          // ADDED: Track status per item/seller!
          type: String,
          enum: [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "cancelled",
            "returned",
          ],
          default: "pending",
        },
      },
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      fullName: String,
      mobile: String,
      house: String,
      street: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: "pending" },

    orderStatus: { type: String, default: "pending" },
  },
  { timestamps: true },
);

const Order = mongoose.model("order", orderSchema);
export default Order;
