import wishlistModel from "../models/wishlistModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.sub || req.user.id;

  let wishlist = await wishlistModel.findOne({ userId });

  if (!wishlist) {
    wishlist = new wishlistModel({ userId, items: [{ productId }] });
  } else {
    const exists = wishlist.items.find(
      (item) => item.productId.toString() === productId,
    );
    if (exists) {
      return res.status(200).json({ message: "Already in wishlist" });
    }
    wishlist.items.push({ productId });
  }

  await wishlist.save();
  res.status(200).json({ message: "Added to wishlist", wishlist });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const wishlist = await wishlistModel
    .findOne({ userId })
    .populate("items.productId", "name price finalPrice brand images");

  if (!wishlist) {
    return res.status(200).json({ message: "Wishlist empty", items: [] });
  }

  res.status(200).json({ message: "Wishlist fetched", wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.sub || req.user.id;

  const wishlist = await wishlistModel.findOne({ userId });
  if (!wishlist) throw new CustomError("Wishlist not found", 404);

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId,
  );
  await wishlist.save();

  res.status(200).json({ message: "Removed from wishlist", wishlist });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  await wishlistModel.findOneAndDelete({ userId });
  res.status(200).json({ message: "Wishlist cleared" });
});
