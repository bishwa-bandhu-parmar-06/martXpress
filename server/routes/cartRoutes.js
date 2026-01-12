import express from "express";
import { verifyToken, verifyUser } from "../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartControllers.js";

const router = express.Router();
router.use(verifyToken, verifyUser);

router.post("/add-to-cart", addToCart);
router.get("/get-all-cart-item", getCart);
router.delete("/remove/:productId", removeFromCart);
router.delete("/clear/all", clearCart);

export default router;
