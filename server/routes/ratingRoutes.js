import express from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  addOrUpdateRating,
  getProductRatings,
  getMyRating,
  deleteRating,
} from "../controllers/ratingControllers.js";

import redisClient from "../config/redisClient.js";
import { cacheMiddleware } from "../middleware/redisMiddleware.js";

const router = express.Router();

/* ---------------- RATE LIMITERS ---------------- */

const ratingWriteLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Too many rating attempts. Please try later.",
  },
});

const ratingReadLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 1 * 60 * 1000, // 1 min
  max: 60,
  keyGenerator: (req) => req.user.id,
});

/* ---------------- ROUTES ---------------- */

// Login required
router.use(verifyToken, authorizeRoles("user"));

// Add or update rating
router.post(
  "/add-rating",
  // ratingWriteLimiter,
  addOrUpdateRating
);

// Get all ratings for a product
router.get(
  "/product-all-rating/:productId",
  cacheMiddleware(5 * 60), 
  // ratingReadLimiter,
  getProductRatings
);

// Get my rating
router.get(
  "/product-rating/:productId",
  // ratingReadLimiter,
    cacheMiddleware(5 * 60), 
  getMyRating
);

// Delete rating
router.post(
  "/delete-rating/:productId",
  // ratingWriteLimiter,
  deleteRating
);

export default router;
