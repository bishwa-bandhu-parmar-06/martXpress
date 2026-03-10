import Razorpay from "razorpay";
import crypto from "crypto";
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
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

// 2. BULLETPROOF PAYMENT VERIFICATION
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

  // --- 1. VERIFY SIGNATURE FIRST ---
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new CustomError(
      "Missing Razorpay signature details from frontend",
      400,
    );
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    console.error(
      "❌ Signature Mismatch! Expected:",
      expectedSignature,
      "Got:",
      razorpay_signature,
    );
    throw new CustomError(
      "Payment verification failed. Invalid signature.",
      400,
    );
  }

  // --- 2. VALIDATE FRONTEND DATA ---
  if (!checkoutItems || checkoutItems.length === 0) {
    throw new CustomError("No items provided for checkout", 400);
  }
  if (!shippingAddress) {
    throw new CustomError("Shipping address is missing", 400);
  }

  // --- 3. FETCH SELLER IDs SAFELY FROM DATABASE ---
  // We MUST map the sellerId, otherwise orderModel.create() will crash with a 400 ValidationError!
  const orderItems = await Promise.all(
    checkoutItems.map(async (item) => {
      const pId = item.productId || item.product?._id;

      // Fetch product to securely grab the required sellerId
      const product = await productModel
        .findById(pId)
        .select("sellerId price finalPrice");

      if (!product) {
        throw new CustomError(`Product not found during checkout`, 404);
      }

      return {
        productId: pId,
        sellerId: product.sellerId, // Grabbed directly from DB!
        quantity: item.quantity,
        price: item.price || product.finalPrice || product.price,
      };
    }),
  );

  // --- 4. CREATE ORDER ---
  const newOrder = await orderModel.create({
    userId,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod: "Razorpay",
    paymentStatus: "completed",
    orderStatus: "processing",
  });

  // --- 5. CLEAR CART ---
  if (!isBuyNow) {
    await cartModel.findOneAndDelete({ userId });
  }

  res.status(200).json({
    success: true,
    message: "Payment verified and order placed successfully",
    orderId: newOrder._id,
  });
});
