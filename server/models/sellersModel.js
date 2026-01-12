import mongoose from "mongoose";
import validator from "validator";

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 60,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      validate: [validator.isEmail, "Invalid email"],
    },

    mobile: {
      type: String,
      index: true,
      validate: {
        validator: (v) => /^[6-9]\d{9}$/.test(v),
        message: "Invalid phone number",
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    shopName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    gstNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    udyamNumber: { type: String, trim: true },
    panNumber: { type: String, trim: true },

    TermsAndCdn: {
      type: Boolean,
      required: [true, "Terms and Conditions acceptance is required"],
      default: false,
    },
    gstCertificate: {
      fileName: String,
      path: String,
      uploadedAt: Date,
    },

    udyamCertificate: String,
    stats: {
      totalProducts: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      totalRevenue: { type: Number, default: 0 },
    },
    verified: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
      },
    ],
    role: {
      type: String,
      enum: ["seller", "admin", "user"],
      default: "seller",
      index: true,
    },
  },
  { timestamps: true }
);

sellerSchema.index({ verified: 1, shopName: 1 });
sellerSchema.index({ createdAt: -1 });
sellerSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.password; // extra safety
    return ret;
  },
});

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
