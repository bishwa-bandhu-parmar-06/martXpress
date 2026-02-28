import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import { addToCart, getCart, removeFromCart, clearCart, updateCartQuantity } from "../controllers/cartControllers.js";

const router = express.Router();

// Apply global protection to all cart routes
router.use(verifyToken);
router.use(authorizeRoles("user"));

router.post("/add-to-cart", addToCart);
router.get("/get-all-cart-item", getCart);
router.post("/update/:productId", updateCartQuantity);
router.post("/remove/:productId", removeFromCart);
router.post("/clear", clearCart);

export default router;