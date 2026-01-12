import ratingModel from "../models/ratingModel.js";
import productModel from "../models/productModel.js";

/* ---------------------- Add or Update Rating ---------------------- */
export const addOrUpdateRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, review } = req.body;

    if (!productId || !rating) {
      return res.status(400).json({
        status: 400,
        message: "Product ID and rating are required.",
      });
    }

    // Check if product exists
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: 404,
        message: "Product not found.",
      });
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
  } catch (error) {
    console.error("Error adding rating:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

/* ---------------------- Get Ratings for a Product ---------------------- */
export const getProductRatings = async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* ---------------------- Get My Rating for a Product ---------------------- */
export const getMyRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const rating = await ratingModel.findOne({ userId, productId });
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
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

/* ---------------------- Delete My Rating ---------------------- */
export const deleteRating = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const deleted = await ratingModel.findOneAndDelete({ userId, productId });
    if (!deleted) {
      return res.status(404).json({
        status: 404,
        message: "Rating not found or already deleted.",
      });
    }

    // Recalculate product rating
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
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({ status: 500, message: error.message });
  }
};
