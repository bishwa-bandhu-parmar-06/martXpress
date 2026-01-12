import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../uploads/multer.js";
import {
  getSellerProfile,
  updateSellerDetails,
} from "../controllers/sellersControllers.js";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  getAllAddresses,
  getSingleAddress,
} from "../controllers/addressControllers.js";
const routes = express.Router();

// All routes require authentication
routes.use(verifyToken);

// User profile
routes.get("/seller-profile", getSellerProfile);
routes.post(
  "/update-seller-details",
  upload.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "udyamCertificate", maxCount: 1 },
  ]),
  updateSellerDetails
);

// Address management
routes.post("/add-seller-address", addAddress);
routes.get("/all-seller-address", getAllAddresses);
routes.get("/single-address/:addressId", getSingleAddress);
routes.post("/update-seller-address/:addressId", updateAddress);
routes.post("/remove-seller-address/:addressId", deleteAddress);

export default routes;
