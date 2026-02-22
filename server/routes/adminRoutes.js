import express from "express";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware.js";
import {
  getAdminProfile,
  updateAdminDetails,
  changeAdminPassword,
  getApprovedSellers,
  getRejectedSellers,
  getPendingSellers,
  getSellerById,
  approveSeller,
  rejectSeller,
  deleteSeller,
  getAllUsers,
  deleteUser,
  getAllProducts,
  deleteProduct,
  getDashboardStats,
} from "../controllers/adminControllers.js";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getAllAddresses,
  getSingleAddress,
} from "../controllers/addressControllers.js";

const router = express.Router();

import { cacheMiddleware } from "../middleware/redisMiddleware.js";

// Secure all routes for Admin only
router.use(verifyToken, authorizeRoles("admin"));

// Profile
router.get("/profile",cacheMiddleware(5 * 60), getAdminProfile);
router.post("/update", cacheMiddleware(5 * 60), updateAdminDetails);
router.post("/change-password", changeAdminPassword);

// Address
router.post("/address/add", cacheMiddleware(5 * 60), addAddress);
router.get("/address/all", cacheMiddleware(5 * 60), getAllAddresses);
router.get("/address/:addressId",cacheMiddleware(5 * 60),  getSingleAddress);
router.post("/address/:addressId", cacheMiddleware(5 * 60), updateAddress);
router.post("/address/:addressId", deleteAddress);

// Seller Management
router.get("/sellers/approved", cacheMiddleware(5 * 60), getApprovedSellers);
router.get("/sellers/rejected", cacheMiddleware(5 * 60), getRejectedSellers);
router.get("/sellers/pending", cacheMiddleware(1 * 60), getPendingSellers);
router.get("/sellers/:sellerid", getSellerById);
router.post("/sellers/:sellerid/approve", approveSeller);
router.post("/sellers/:sellerid/reject", rejectSeller);
router.post("/sellers/:sellerid/remove", deleteSeller);

// User Management
router.get("/get-all-users", cacheMiddleware(5 * 60), getAllUsers);
router.post("/users/:usersid", deleteUser);

// Product Management
router.get("/get-all-products", cacheMiddleware(5 * 60), getAllProducts);
router.post("/products/:productid", deleteProduct);

// Dashboard
router.get("/dashboard/stats", cacheMiddleware(60), getDashboardStats);

export default router;
