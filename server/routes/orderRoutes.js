import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  requestReturnOrder,
} from "../controllers/orderControllers.js";
import {
  placeOrderLimiter,
  orderReadLimiter,
} from "../middleware/orderRateLimiter.js";
import { cacheMiddleware } from "../middleware/redisMiddleware.js";
const router = express.Router();
router.use(verifyToken, authorizeRoles("user"));

router.post("/place", placeOrder);
router.get(
  "/my-orders",

  getMyOrders,
);
router.get(
  "/get-order/:orderId",

  getOrderById,
);

router.post("/cancel-order/:orderId", cancelOrder);
router.post("/return-order/:orderId", requestReturnOrder);
export default router;
