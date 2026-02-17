import express from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import { verifyToken } from "../middleware/authMiddleware.js";
import { upload } from "../uploads/multer.js";
import redisClient from "../config/redisClient.js";

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

/* ---------------- RATE LIMITERS ---------------- */

const profileReadLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 1 * 60 * 1000, // 1 min
  max: 60,
  keyGenerator: (req) => req.user.id,
});

const profileUpdateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 30 * 60 * 1000, // 30 min
  max: 5,
  keyGenerator: (req) => req.user.id,
  message: {
    status: 429,
    message: "Too many profile updates. Try after some time.",
  },
});

const addressWriteLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyGenerator: (req) => req.user.id,
});

/* ---------------- ROUTES ---------------- */

// Auth required
routes.use(verifyToken);

// Seller profile
routes.get("/seller-profile", getSellerProfile);

// Update seller details (files + DB)
routes.post(
  "/update-seller-details",
  // profileUpdateLimiter,
  upload.fields([
    { name: "gstCertificate", maxCount: 1 },
    { name: "udyamCertificate", maxCount: 1 },
  ]),
  updateSellerDetails,
);

// Address management
routes.post("/add-seller-address", addAddress);

routes.get("/all-seller-address", getAllAddresses);

routes.get("/single-address/:addressId", getSingleAddress);

routes.post(
  "/update-seller-address/:addressId",
  // addressWriteLimiter,
  updateAddress,
);

routes.post(
  "/remove-seller-address/:addressId",
  // addressWriteLimiter,
  deleteAddress,
);

export default routes;
