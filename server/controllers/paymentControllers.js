import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Order ID
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body; // Amount should come in rupees

  if (!amount) throw new CustomError("Amount is required", 400);

  const options = {
    amount: amount * 100, // Razorpay expects amount in PAISE (multiply by 100)
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpayInstance.orders.create(options);

  if (!order) throw new CustomError("Failed to create Razorpay order", 500);

  res.status(200).json({
    success: true,
    order, // Send the order details to frontend
  });
});

// 2. Verify Payment and Save to Database
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    checkoutItems,
    shippingAddress,
    totalAmount,
    isBuyNow,
  } = req.body;

  // Verify the signature mathematically to ensure payment is legit
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    throw new CustomError(
      "Payment verification failed. Invalid signature.",
      400,
    );
  }

  // Format items for the database
  const orderItems = checkoutItems.map((item) => ({
    productId: item.productId || item.product._id,
    quantity: item.quantity,
    price: item.price || item.product.price,
  }));

  // Create the actual order in your database
  const newOrder = await orderModel.create({
    userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod: "Razorpay",
    paymentStatus: "completed",
    orderStatus: "processing",
  });

  // If they bought from the cart, clear the cart
  if (!isBuyNow) {
    await cartModel.findOneAndDelete({ userId });
  }

  res.status(200).json({
    success: true,
    message: "Payment verified and order placed successfully",
    orderId: newOrder._id,
  });
});
