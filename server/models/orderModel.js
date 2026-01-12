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
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
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
    paymentStatus: { type: String, default: "pending" }, // pending, completed, failed
    orderStatus: { type: String, default: "pending" }, // pending, shipped, delivered, cancelled
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);
export default Order;
