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
import { cacheMiddleware } from "../middleware/redisMiddleware.js";
const router = express.Router();

// Public routes
router.get("/products", cacheMiddleware(600), getAllProducts);
router.get("/product/:productId", getSingleProduct);
router.get("/seller/:sellerId/products", getProductsBySeller);
router.get("/search", searchProducts);
router.get("/featured", cacheMiddleware(600), getFeaturedProducts);
router.get("/categories", cacheMiddleware(600), getCategories);
router.get("/all-brands", cacheMiddleware(600), getBrands);
router.get("/products/brand/:brand", cacheMiddleware(600), getProductsByBrand);

//
router.get(
  "/homepage-grouped",
  cacheMiddleware(600),
  getGroupedProductsByCategory,
);
router.get("/hero-slider", cacheMiddleware(600), getHeroSliderProducts);

// New category routes
router.get(
  "/products/category/:categoryName",
  cacheMiddleware(600),
  getProductsByCategory,
);
router.get("/all-categories", cacheMiddleware(600), getAllCategories);
router.get(
  "/top-category/:categoryName",
  cacheMiddleware(600),
  getTopCategoryProducts,
);

router.get(
  "/category/:categoryName/top-featured",
  cacheMiddleware(600),
  getCategoryTopFeaturedProducts,
);
export default router;
