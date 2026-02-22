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
import { cacheMiddleware } from "../middleware/redisMiddleware.js";

const router = express.Router();

/* ---------------- RATE LIMITERS ---------------- */

const wishlistReadLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 1 * 60 * 1000, // 1 min
  max: 60,
  keyGenerator: (req) => req.user.id,
});

const wishlistWriteLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Too many wishlist actions. Try again later.",
  },
});

const wishlistClearLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Wishlist clear limit reached. Try later.",
  },
});

/* ---------------- ROUTES ---------------- */

router.use(verifyToken, authorizeRoles("user"));

// Wishlist routes
router.post("/add-to-wishlist", addToWishlist);

router.get("/get-all-wishlist",cacheMiddleware(5 * 60), getWishlist);

router.post(
  "/remove-wishlist/:productId",
  removeFromWishlist,
);

router.post("/clear/all", clearWishlist);

export default router;
