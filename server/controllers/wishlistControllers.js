import Wishlist from "../models/wishlistModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CustomError } from "../utils/customError.js";
import mongoose from "mongoose";

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user?.sub || req.user?.id;
  const MAX_WISHLIST_ITEMS = 100; // Industry standard limit

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new CustomError("Invalid product ID", 400);
  }

  // 1. Find or create the wishlist atomically
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { upsert: true, new: true },
  );

  // 2. Check if already exists
  const exists = wishlist.items.some(
    (item) => item.productId.toString() === productId,
  );
  if (exists) {
    return res
      .status(200)
      .json({ success: true, message: "Already in wishlist" });
  }

  // 3. Enforce limits for scalability
  if (wishlist.items.length >= MAX_WISHLIST_ITEMS) {
    throw new CustomError(
      `Wishlist limit of ${MAX_WISHLIST_ITEMS} items reached`,
      400,
    );
  }

  // 4. Add the item
  wishlist.items.push({ productId });
  await wishlist.save();

  res
    .status(200)
    .json({ success: true, message: "Added to wishlist", wishlist });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;

  const wishlist = await Wishlist.findOne({ userId })
    .populate(
      "items.productId",
      "name price finalPrice brand images stock status",
    )
    .lean(); // .lean() for faster read-only performance

  if (!wishlist) {
    return res
      .status(200)
      .json({ success: true, message: "Wishlist empty", items: [] });
  }

  // Filter out items where the product might have been deleted from the DB
  const validItems = wishlist.items.filter((item) => item.productId !== null);

  res.status(200).json({
    success: true,
    message: "Wishlist fetched",
    items: validItems,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user?.sub || req.user?.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new CustomError("Invalid product ID", 400);
  }

  // Use $pull for atomic removal (prevents race conditions)
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } },
    { new: true },
  );

  if (!wishlist) throw new CustomError("Wishlist not found", 404);

  res
    .status(200)
    .json({ success: true, message: "Removed from wishlist", wishlist });
});

export const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;

  await Wishlist.findOneAndDelete({ userId });

  res.status(200).json({ success: true, message: "Wishlist cleared" });
});
