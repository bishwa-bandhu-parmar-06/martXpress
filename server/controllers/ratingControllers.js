import ratingModel from "../models/ratingModel.js";
import productModel from "../models/productModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {CustomError} from "../utils/customError.js";

/* ---------------------- Add or Update Rating ---------------------- */
export const addOrUpdateRating = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const { productId, rating, review } = req.body;

  if (!productId || !rating) {
    throw new CustomError("Product ID and rating are required.", 400);
  }

  // Check if product exists
  const product = await productModel.findById(productId);
  if (!product) {
    throw new CustomError("Product not found.", 404);
  }

  // Check if user has already rated
  let existingRating = await ratingModel.findOne({ userId, productId });

  if (existingRating) {
    existingRating.rating = rating;
    if (review) existingRating.review = review;
    await existingRating.save();
  } else {
    existingRating = await ratingModel.create({
      userId,
      productId,
      rating,
      review,
    });
  }

  // Recalculate average rating & total ratings
  const ratings = await ratingModel.find({ productId });
  const totalRatings = ratings.length;
  const averageRating =
    ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

  product.averageRating = averageRating.toFixed(1);
  product.totalRatings = totalRatings;
  await product.save();

  res.status(200).json({
    status: 200,
    message: "Rating submitted successfully.",
    rating: existingRating,
    averageRating: product.averageRating,
    totalRatings: product.totalRatings,
  });
});

/* ---------------------- Get Ratings for a Product ---------------------- */
export const getProductRatings = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const ratings = await ratingModel
    .find({ productId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: 200,
    message: "Ratings fetched successfully.",
    count: ratings.length,
    ratings,
  });
});

/* ---------------------- Get My Rating for a Product ---------------------- */
export const getMyRating = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.sub || req.user.id;

  const rating = await ratingModel.findOne({ userId, productId });

  // Note: Keeping this as a 200 response because not having a rating
  // isn't an "error", it just means the UI should show empty stars!
  if (!rating) {
    return res.status(200).json({
      status: 200,
      message: "You have not rated this product yet.",
    });
  }

  res.status(200).json({
    status: 200,
    message: "Your rating fetched successfully.",
    rating,
  });
});

/* ---------------------- Delete My Rating ---------------------- */
export const deleteRating = asyncHandler(async (req, res) => {
  const userId = req.user.sub || req.user.id;
  const { productId } = req.params;

  const deleted = await ratingModel.findOneAndDelete({ userId, productId });
  if (!deleted) {
    throw new CustomError("Rating not found or already deleted.", 404);
  }

  // Recalculate product rating after deletion
  const ratings = await ratingModel.find({ productId });
  const totalRatings = ratings.length;
  const averageRating =
    totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

  await productModel.findByIdAndUpdate(productId, {
    averageRating: averageRating.toFixed(1),
    totalRatings,
  });

  res.status(200).json({
    status: 200,
    message: "Rating deleted successfully.",
  });
});
