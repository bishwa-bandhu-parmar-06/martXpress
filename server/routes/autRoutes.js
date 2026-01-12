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

// const registerOtpLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5, // ek IP se sirf 5 OTP sends 15 min me
//   message: { status: 429, message: "Too many OTP requests, try again later." },
// });

// routes.use(registerOtpLimiter);


// users register routes
routes.post("/register-users", registerUsers);
// admin register routes
routes.post("/register-admin", registerAdmin);
// sellers register routes
routes.post(
  "/register-seller",
  upload.single("gstCertificate"),
  registerSeller
);

// all type of users role can login here
routes.post("/login", login);
// login otp verification for all type of users role
routes.post("/verify-otp", verifyOtp);
// resend otp to register or login
routes.post("/resend-otp", resendOtp);

export default routes;
