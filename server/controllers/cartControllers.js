import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import mongoose from "mongoose";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;

  if (!userId) throw new CustomError("Unauthorized", 401);
  if (req.user.role !== "user")
    throw new CustomError("Only users can add to cart", 403);

  const { productId, quantity = 1 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new CustomError("Invalid product ID", 400);

  if (quantity < 1 || quantity > 10)
    throw new CustomError("Invalid quantity", 400);

  const product = await productModel.findById(productId);

  if (!product || product.status !== "active")
    throw new CustomError("Product unavailable", 404);

  if (product.stock < quantity)
    throw new CustomError("Insufficient stock", 400);

  const price = product.finalPrice || product.price;

  // Atomic upsert
  const cart = await cartModel.findOneAndUpdate(
    { userId },
    {
      $setOnInsert: { userId },
      $inc: { totalQuantity: quantity },
    },
    { new: true, upsert: true },
  );

  const existingItem = cart.items.find(
    (item) => item.productId.toString() === productId,
  );

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;

    if (newQty > product.stock)
      throw new CustomError("Stock limit exceeded", 400);

    existingItem.quantity = newQty;
    existingItem.subtotal = newQty * existingItem.price;
  } else {
    if (cart.items.length >= 50)
      throw new CustomError("Cart limit exceeded", 400);

    cart.items.push({
      productId,
      name: product.name,
      image: product.images?.[0] || "",
      price,
      quantity,
      subtotal: price * quantity,
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;

  if (!userId) throw new CustomError("Unauthorized", 401);

  const cart = await cartModel.findOne({ userId }).lean();

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalPrice: 0, totalQuantity: 0 },
    });
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

export const updateCartQuantity = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new CustomError("Invalid product ID", 400);

  if (quantity < 1 || quantity > 10)
    throw new CustomError("Invalid quantity", 400);

  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new CustomError("Cart not found", 404);

  const item = cart.items.find(
    (item) => item.productId.toString() === productId,
  );

  if (!item) throw new CustomError("Item not found in cart", 404);

  const product = await productModel.findById(productId);
  if (product.stock < quantity)
    throw new CustomError("Insufficient stock", 400);

  item.quantity = quantity;
  item.subtotal = quantity * item.price;

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Quantity updated",
    cart,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId))
    throw new CustomError("Invalid product ID", 400);

  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new CustomError("Cart not found", 404);

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Item removed",
    cart,
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;

  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new CustomError("Cart not found", 404);

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
  });
});
