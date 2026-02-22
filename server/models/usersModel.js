import mongoose from "mongoose";
import validator from "validator";
import { required } from "zod/mini";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    password: {
      type: String,
      select: false,
      required: [true, "Please enter your email"],
    },
    mobile: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
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

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

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

    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
  },
  { timestamps: true },
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model("user", userSchema);
export default User;
