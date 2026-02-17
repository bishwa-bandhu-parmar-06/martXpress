import express from "express";
import { verifyToken, verifyUser } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartControllers.js";
import { cartLimiter } from "../middleware/cartRateLimiter.js";
const router = express.Router();
router.use(verifyToken, verifyUser);

router.post("/add-to-cart",  addToCart);
router.get("/get-all-cart-item",  getCart);
router.post("/remove/:productId",  removeFromCart);
router.post("/clear/all", clearCart);

export default router;
