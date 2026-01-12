import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  getProductsBySeller,
  searchProducts,
  getFeaturedProducts,
  getCategories,
  getBrands,
} from "../controllers/webController.js";

const router = express.Router();

// Public routes
router.get("/products", getAllProducts);
router.get("/product/:productId", getSingleProduct);
router.get("/seller/:sellerId/products", getProductsBySeller);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/brands", getBrands);

export default router;
