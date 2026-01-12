import express from "express";
import { verifyToken, verifyUser } from "../middleware/authMiddleware.js";
import {
  addOrUpdateRating,
  getProductRatings,
  getMyRating,
  deleteRating,
} from "../controllers/ratingControllers.js";

const router = express.Router();

// Require login for rating
router.use(verifyToken, verifyUser);

// Rate or update
router.post("/add-rating", addOrUpdateRating);

// Get all ratings for a product
router.get("/product-all-rating/:productId", getProductRatings);

// Get my rating for a specific product
router.get("/product-rating/:productId", getMyRating);

// Delete my rating
router.post("/delete-rating/:productId", deleteRating);

export default router;
