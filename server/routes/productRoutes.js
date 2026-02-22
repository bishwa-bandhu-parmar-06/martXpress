import express from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import {
  addProduct,
  getAllProductsAddedByLoggedInSeller,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} from "../controllers/productControllers.js";

import { upload } from "../uploads/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import redisClient from "../config/redisClient.js";
import { cacheMiddleware } from "../middleware/redisMiddleware.js";

const router = express.Router();

/* -------------------- RATE LIMITERS -------------------- */

const addProductLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Too many product uploads. Try again later.",
  },
});

const updateProductLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 10 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Too many update requests.",
  },
});

const deleteProductLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Too many delete attempts.",
  },
});

const readProductLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 1 * 60 * 1000, // 1 min
  max: 30,
  keyGenerator: (req) => req.user.id,
});

/* -------------------- ROUTES -------------------- */

//  All routes protected
router.use(verifyToken);

// Add product
router.post("/add", cacheMiddleware(600), upload.array("images", 5), addProduct);

// Seller products
router.get(
  "/my-products",
  // readProductLimiter,
  cacheMiddleware(600), 
  getAllProductsAddedByLoggedInSeller,
);

// Single product
router.get("/:productId", cacheMiddleware(600), getSingleProduct);

// Update product
router.post(
  "/update/:productId",
  // updateProductLimiter,
  cacheMiddleware(600),
  upload.array("images", 5),
  updateProduct,
);

// Delete product
router.post("/delete/:productId", deleteProduct);

export default router;
