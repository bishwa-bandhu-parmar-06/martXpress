import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const { productId, quantity = 1 } = req.body;

  const product = await productModel.findById(productId);
  if (!product) throw new CustomError("Product not found", 404);

  let cart = await cartModel.findOne({ userId });

  if (!cart) {
    cart = new cartModel({
      userId,
      items: [{ productId, quantity, price: product.finalPrice }],
      totalPrice: product.finalPrice * quantity,
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price: product.finalPrice });
    }

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  await cart.save();
  return res.status(200).json({ message: "Product added to cart", cart });
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const cart = await cartModel
    .findOne({ userId })
    .populate("items.productId", "name brand price finalPrice images");

  if (!cart) {
    return res.status(200).json({ message: "Cart is empty", items: [] });
  }

  res.status(200).json({ message: "Cart fetched successfully", cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.sub || req.user.id;

  const cart = await cartModel.findOne({ userId });
  if (!cart) throw new CustomError("Cart not found", 404);

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  cart.totalPrice = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  await cart.save();
  res.status(200).json({ message: "Item removed from cart", cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  await cartModel.findOneAndDelete({ userId });
  res.status(200).json({ message: "Cart cleared successfully" });
});
