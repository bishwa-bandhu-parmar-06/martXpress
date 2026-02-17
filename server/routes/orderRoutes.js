import express from "express";
import { verifyToken, verifyUser } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderControllers.js";
import {
  placeOrderLimiter,
  orderReadLimiter,
} from "../middleware/orderRateLimiter.js";
import { cacheMiddleware } from "../middleware/redisMiddleware.js";
const router = express.Router();
router.use(verifyToken, verifyUser);

router.post("/place", placeOrder);
router.get(
  "/my-orders",
  // orderReadLimiter,
  cacheMiddleware(5 * 60),
  getMyOrders,
);
router.get(
  "/get-order/:orderId",
  // orderReadLimiter,
  cacheMiddleware(5 * 60),
  getOrderById,
);

export default router;
