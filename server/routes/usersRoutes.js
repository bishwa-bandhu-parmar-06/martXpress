import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUsersDetails,
} from "../controllers/usersControllers.js";
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
routes.get("/user-profile", getUserProfile);
routes.post("/update-user-details", updateUsersDetails);

// Address management
routes.post("/add-user-address", addAddress);
routes.get("/all-user-address", getAllAddresses);
routes.get("/single-address/:addressId", getSingleAddress);
routes.post("/update-user-address/:addressId", updateAddress);
routes.post("/remove-user-address/:addressId", deleteAddress);

export default routes;
