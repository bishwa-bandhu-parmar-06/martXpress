import express from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import redisClient from "../config/redisClient.js";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistControllers.js";

const router = express.Router();

/* ---------------- RATE LIMITERS ---------------- */
// Simplified and kept for security
const wishlistWriteLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 50, // Generous enough for normal users, strict enough to stop bots
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Too many wishlist actions. Try again later.",
  },
});

/// 1. Ensure logged in
router.use(verifyToken);
// 2. Ensure only 'user' role can proceed
router.use(authorizeRoles("user"));

router.get("/get-all-wishlist", getWishlist);
router.post("/add-to-wishlist", wishlistWriteLimiter, addToWishlist);
router.post("/remove/:productId", wishlistWriteLimiter, removeFromWishlist);
router.post("/clear/all", wishlistWriteLimiter, clearWishlist);

export default router;
