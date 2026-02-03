import express from "express";
import {
  addProduct,
  getAllProductsAddedByLoggedInSeller,
  updateProduct,
  deleteProduct,
  getSingleProduct,
} from "../controllers/productControllers.js";
import { upload } from "../uploads/multer.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below are protected — only for logged-in sellers
router.use(verifyToken);

// Add product
router.post("/add", upload.array("images", 5), addProduct);

// Get all products of logged-in seller
router.get("/my-products", getAllProductsAddedByLoggedInSeller);

// Get single product
router.get("/:productId", getSingleProduct);

// Update product
router.post("/update/:productId", upload.array("images", 5), updateProduct);

// Delete product
router.post("/delete/:productId", deleteProduct);

export default router;
