import express from "express";
import { verifyToken, verifyUser } from "../middleware/authMiddleware.js";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
} from "../controllers/orderControllers.js";

const router = express.Router();
router.use(verifyToken, verifyUser);

router.post("/place", placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/get-order/:orderId", getOrderById);

export default router;
