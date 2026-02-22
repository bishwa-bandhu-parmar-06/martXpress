import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartControllers.js";
import { cacheMiddleware } from "../middleware/redisMiddleware.js";

import { cartLimiter } from "../middleware/cartRateLimiter.js";
const router = express.Router();
router.use(verifyToken, authorizeRoles("user"));
router.post("/add-to-cart", addToCart);
router.get("/get-all-cart-item", cacheMiddleware(5 * 60),  getCart);
router.post("/remove/:productId",  removeFromCart);
router.post("/clear/all", clearCart);

export default router;
