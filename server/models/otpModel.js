const mongoose = require("mongoose");
const modelConstant = require("../utils/modelConstant");

const otpSchema = new mongoose.Schema(
  {
    usersId: {
      type: String,
      required: true,
      refPath: "role",
    },
    role: {
      type: String,
      default: "User",
      enum: ["Seller", "User", "Admin"],
    },
    email: {
        type: String,
        required: true
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const otpModel = mongoose.model(modelConstant.OTP, otpSchema);
module.exports = otpModel;
