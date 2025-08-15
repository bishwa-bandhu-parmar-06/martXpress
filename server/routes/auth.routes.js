const express = require("express");
const router = express.Router();
const { upload } = require("../utils/uploads/multer");

const {
  registerUsers,
  loginWithPassword,
  forgetPassword,
  verifyResetOtp,
  resetPassword,
  loginWithEmailOtp,
  verifyLoginotp,
  registerSeller,
  registerAdmin,
  validateOtp,
  logout,
} = require("../controllers/auth.Controller");

router.post("/register-users", registerUsers);
router.post(
  "/register-sellers",
  upload.single("gst_Certificate"),
  registerSeller
);
router.post("/register-admin", registerAdmin);
router.post("/login-password", loginWithPassword);
router.post("/login-with-emailOtp", loginWithEmailOtp);

router.post("/validate-otp", validateOtp);
router.post("/validate-loginotp", verifyLoginotp);
router.post("/logout", logout);
router.post("/forget-password", forgetPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);
module.exports = router;
