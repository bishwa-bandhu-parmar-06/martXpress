import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

export const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await cartModel
    .findOne({ userId })
    .populate("items.productId", "name price finalPrice");

  if (!cart || cart.items.length === 0) {
    throw new CustomError("Cart is empty", 400);
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const newOrder = await orderModel.create({
    userId,
    items: cart.items.map((i) => ({
      productId: i.productId._id,
      quantity: i.quantity,
      price: i.price,
    })),
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "pending" : "processing",
  });

  await cartModel.findOneAndDelete({ userId });

  res.status(200).json({
    message: "Order placed successfully",
    order: newOrder,
  });
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const orders = await orderModel
    .find({ userId })
    .populate("items.productId", "name brand images price")
    .sort({ createdAt: -1 });

  res.status(200).json({
    message: "Orders fetched successfully",
    count: orders.length,
    orders,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const order = await orderModel
    .findOne({ _id: req.params.orderId, userId })
    .populate("items.productId", "name images price");

  if (!order) throw new CustomError("Order not found", 404);

  res.status(200).json({ message: "Order details fetched", order });
});
