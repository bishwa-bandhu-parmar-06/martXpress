import express from "express";
import { verifyToken, verifyUser } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistControllers.js";

const router = express.Router();
router.use(verifyToken, verifyUser);

router.post("/add-to-wishlist", addToWishlist);
router.get("/get-all-wishlist", getWishlist);
router.delete("/remove-wishlist/:productId", removeFromWishlist);
router.delete("/clear/all", clearWishlist);

export default router;
