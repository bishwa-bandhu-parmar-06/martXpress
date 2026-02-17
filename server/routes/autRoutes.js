import express from "express";
import rateLimit from "express-rate-limit";
const routes = express.Router();

import {
  registerUsers,
  verifyOtp,
  login,
  registerAdmin,
  registerSeller,
  resendOtp,
} from "../controllers/authControllers.js";
import { upload } from "../uploads/multer.js";

const registerOtpLimiter = rateLimit({
  windowMs: 3 * 60 * 60 * 1000, //3hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many attempts. Please try again after 3 hours.",
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    status: 429,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});

const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    status: 429,
    message: "Too many OTP verification attempts.",
  },
});

// routes.use(registerOtpLimiter);

// users register routes
routes.post("/register-users",  registerUsers);
// admin register routes
routes.post("/register-admin",  registerAdmin);
// sellers register routes
routes.post(
  "/register-seller",
  // registerOtpLimiter,
  upload.single("gstCertificate"),
  registerSeller,
);

// all type of users role can login here
routes.post("/login", login);
// login otp verification for all type of users role
routes.post("/verify-otp",  verifyOtp);
// resend otp to register or login
routes.post("/resend-otp",  resendOtp);

export default routes;
