import express from "express";
import { verifyToken, verifyAdmin } from "../middleware/authMiddleware.js";
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

// Secure all routes for Admin only
router.use(verifyToken, verifyAdmin);

// Profile
router.get("/profile", getAdminProfile);
router.put("/update", updateAdminDetails);
router.put("/change-password", changeAdminPassword);

// Address
router.post("/address/add", addAddress);
router.get("/address/all", getAllAddresses);
router.get("/address/:addressId", getSingleAddress);
router.put("/address/:addressId", updateAddress);
router.post("/address/:addressId", deleteAddress);

// Seller Management
router.get("/sellers/approved", getApprovedSellers);
router.get("/sellers/rejected", getRejectedSellers);
router.get("/sellers/pending", getPendingSellers);
router.get("/sellers/:sellerid", getSellerById);
router.post("/sellers/:sellerid/approve", approveSeller);
router.post("/sellers/:sellerid/reject", rejectSeller);
router.post("/sellers/:sellerid/remove", deleteSeller);

// User Management
router.get("/get-all-users", getAllUsers);
router.post("/users/:usersid", deleteUser);

// Product Management
router.get("/get-all-products", getAllProducts);
router.post("/products/:productid", deleteProduct);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

export default router;
