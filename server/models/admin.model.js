const mongoose = require("mongoose");
const modelConstant = require("../utils/modelConstant");
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  verifiedEmail: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  mobile: {
    type: String,
    required: false,
  },
  address: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    district: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    pincode: {
      type: String,
      required: false,
    },
  },
  role: {
    type: String,
    default: "Admin",
    enum: ["Seller", "User", "Admin"],
  },
});

const adminModel = mongoose.model(modelConstant.ADMIN, adminSchema);
module.exports = adminModel;
