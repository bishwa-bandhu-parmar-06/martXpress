import express from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";

import { verifyToken , authorizeRoles} from "../middleware/authMiddleware.js";
import redisClient from "../config/redisClient.js";

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
import { cacheMiddleware } from "../middleware/redisMiddleware.js";

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
    message: "Too many profile updates. Try again later.",
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
routes.use(verifyToken, authorizeRoles("user"));
// User profile
routes.get("/user-profile", cacheMiddleware(5 * 60), getUserProfile);

routes.post("/update-user-details",  updateUsersDetails);

// Address management
routes.post("/add-user-address", cacheMiddleware(5 * 60),addAddress);

routes.get("/all-user-address", cacheMiddleware(5 * 60),getAllAddresses);

routes.get("/single-address/:addressId", cacheMiddleware(5 * 60),getSingleAddress);

routes.post(
  "/update-user-address/:addressId",
  // addressWriteLimiter,
  updateAddress,
);

routes.post(
  "/remove-user-address/:addressId",
  // addressWriteLimiter,
  deleteAddress,
);

export default routes;
