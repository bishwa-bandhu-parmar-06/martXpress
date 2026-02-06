import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  getProductsBySeller,
  searchProducts,
  getFeaturedProducts,
  getCategories,
  getBrands,
  getGroupedProductsByCategory,
  getHeroSliderProducts,
  getProductsByCategory,
  getAllCategories,
  getTopCategoryProducts,
  getCategoryTopFeaturedProducts,
} from "../controllers/webController.js";
import { getProductsByBrand } from "../controllers/brandsControllers.js";

const router = express.Router();

// Public routes
router.get("/products", getAllProducts);
router.get("/product/:productId", getSingleProduct);
router.get("/seller/:sellerId/products", getProductsBySeller);
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);
router.get("/all-brands", getBrands);
router.get("/products/brand/:brand", getProductsByBrand);

//
router.get("/homepage-grouped", getGroupedProductsByCategory);
router.get("/hero-slider", getHeroSliderProducts);

// New category routes
router.get("/products/category/:categoryName", getProductsByCategory);
router.get("/all-categories", getAllCategories);
router.get("/top-category/:categoryName", getTopCategoryProducts);

router.get(
  "/category/:categoryName/top-featured",
  getCategoryTopFeaturedProducts,
);
export default router;
