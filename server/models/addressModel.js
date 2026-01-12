import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "role", // dynamically reference User or Seller collection
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "seller", "admin"], // specify whether it's a user or seller
    },
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    house: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
  },
  { timestamps: true }
);

const Address = mongoose.model("address", addressSchema);
export default Address;
