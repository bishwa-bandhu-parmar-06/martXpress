import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "", // Empty by default, user can update later
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    mobile: {
      type: String,
      default: "", // Empty by default, user can add later
      validate: {
        validator: function (v) {
          // Only validate if mobile is provided
          if (!v) return true;
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Please enter a valid 10-digit phone number",
      },
    },
    role: {
      type: String,
      enum: ["user", "admin", "seller"],
      default: "user",
    },

    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Profile completion status
    isProfileComplete: {
      type: Boolean,
      default: false,
    },
    // Summary fields (can be populated later)
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalCartItems: {
      type: Number,
      default: 0,
    },
    totalWishlistItems: {
      type: Number,
      default: 0,
    },

    // Addresses (can be added later)
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
