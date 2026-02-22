import express from "express";
import rateLimit from "express-rate-limit";

const routes = express.Router();

import {
  registerUsers,
  login,
  registerAdmin,
  registerSeller,
} from "../controllers/authControllers.js";
import { upload } from "../uploads/multer.js";
import { validate } from "../middleware/validate_middleware.js";
import {
  loginSchema,
  registerSchema,
  sellerRegisterSchema,
} from "../validators/auth_validators.js";

const registerOtpLimiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many attempts. Please try again after 3 hours.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    status: 429,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});

// users register routes
routes.post("/register-users", validate(registerSchema), registerUsers);
// admin register routes
routes.post("/register-admin", validate(registerSchema), registerAdmin);
// sellers register routes
routes.post(
  "/register-seller",
  upload.single("gstCertificate"),
  validate(sellerRegisterSchema),
  registerSeller,
);

// all type of users role can login here
routes.post("/login", validate(loginSchema), login);

export default routes;
