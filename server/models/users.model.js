const mongoose = require("mongoose");
const modelConstant = require("../utils/modelConstant");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: { type: String, required: true ,unique: true},
  mobile: { type: String, require: false },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true },
  profileImage: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    district: { type: String },
    state: { type: String },
    country: {
      type: String
    },
    pincode: { type: String },
  },
  role: {
        type: String,
        default: "users",
        enum: ["seller", "users", "admin"]
    }
});

const User = mongoose.model(modelConstant.USER, userSchema);
module.exports = User;
