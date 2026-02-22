import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: [true, "Please enter password"],
    },

    email: {
      type: String,
      required: [true, "Please enter admin email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address"],
    },
    isEmailVerified: { type: Boolean, default: false },
    mobile: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Please enter a valid 10-digit phone number",
      },
    },
    // Addresses (reference Address model)
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
    // Role & permissions
    role: {
      type: String,
      enum: ["seller", "admin", "user"],
      default: "admin",
    },
    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageSellers: { type: Boolean, default: true },
      manageProducts: { type: Boolean, default: true },
      manageOrders: { type: Boolean, default: true },
      manageCoupons: { type: Boolean, default: true },
      manageBanners: { type: Boolean, default: true },
      manageSettings: { type: Boolean, default: true },
      viewAnalytics: { type: Boolean, default: true },
    },

    // Security
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const Admin = mongoose.model("admin", adminSchema);
export default Admin;
