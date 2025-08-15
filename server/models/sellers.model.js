const mongoose = require("mongoose");
const modelConstant = require("../utils/modelConstant");
const sellerSchema = new mongoose.Schema({
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
  gst: {
    gst_Number: {
      type: String,
      required: true,
    },
    gst_Certificate: {
      type: String,
      required: false,
    },
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
    pincode: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
  },
  role: {
    type: String,
    default: "Seller",
    enum: ["Seller", "User", "Admin"],
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
});

const seller = mongoose.model(modelConstant.SELLER, sellerSchema);
module.exports = seller;
