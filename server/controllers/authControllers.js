import userModel from "../models/usersModel.js";
import sellerModel from "../models/sellersModel.js";
import adminModel from "../models/adminModel.js";
import { generateToken } from "../Helper/generateToken.js";
import bcrypt from "bcryptjs";
import { hashPassword } from "../Helper/hashPassword.js";
import { CustomError } from "../utils/customError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { checkEmailExists } from "../Helper/checkEmailExists.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { resetPasswordTemplate } from "../email/templates/resetPasswordTemplate.js";
import { sendEmail } from "../email/sendemail.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ------------------------------ LOGIN FUNCTION FOR ALL  --------------------------------
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //  validation
  if (!email || !password) {
    throw new CustomError("Email and Password are required", 400);
  }

  const [userData, sellerData, adminData] = await Promise.all([
    userModel.findOne({ email }).select("+password"),
    sellerModel.findOne({ email }).select("+password"),
    adminModel.findOne({ email }).select("+password"),
  ]);

  let user = userData || sellerData || adminData;
  let role = userData ? "user" : sellerData ? "seller" : "admin";

  // don't reveal email existence
  if (!user) {
    throw new CustomError("Invalid credentials", 401);
  }

  // password check
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new CustomError("Invalid credentials", 401);
  }

  // seller verification
  if (role === "seller") {
    if (user.verified !== "approved") {
      throw new CustomError(
        "Account not approved. Please contact support.",
        403,
      );
    }
  }

  // generate token
  const token = generateToken({
    id: user._id,
    role: role,
  });

  // secure cookie (VERY IMPORTANT)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      email: user.email,
      name: user.name || "",
    },
    role,
  });
});

export const googleAuth = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    throw new CustomError("Google token missing", 400);
  }

  // verify google token
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  const { sub, email, name, email_verified, picture } = payload;

  if (!email_verified) {
    throw new CustomError("Google email not verified", 400);
  }

  // check if user exists
  let user = await userModel.findOne({ email });

  if (!user) {
    // create new user
    user = await userModel.create({
      name,
      email,
      googleId: sub,
      authProvider: "google",
      isEmailVerified: true,
    });
  }

  // generate YOUR existing JWT
  const jwtToken = generateToken({
    id: user._id,
    role: "user",
  });

  // set cookie same as your login function
  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Google login successful",
    user: {
      email: user.email,
      name: user.name || "",
    },
    role: "user",
  });
});

// ---------------------  REGSITER USER  --------------------------------
export const registerUsers = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError("Email and Password are required", 400);
  }
  const exists = await checkEmailExists(email);
  if (exists) {
    throw new CustomError("Email already registered with another account", 400);
  }
  await userModel.create({
    email,
    password,
  });
  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

// ---------------------- REGISTER ADMIN ----------------------
export const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Email and Password required", 400);
  }

  const exists = await checkEmailExists(email);

  if (exists) {
    throw new CustomError("Email already registered with another account", 400);
  }

  await adminModel.create({
    email,
    password,
  });

  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
  });
});
// ---------------------- REGISTER SELLER ----------------------
export const registerSeller = asyncHandler(async (req, res) => {
  const { name, email, mobile, shopName, gstNumber, TermsAndCdn, password } =
    req.body;

  // Make GST Certificate optional
  let gstCertificateData = null;

  if (req.file) {
    gstCertificateData = {
      fileName: req.file.originalname || req.file.filename,
      path: req.file.path,
      uploadedAt: new Date(),
    };
  }

  const exists = await checkEmailExists(email);
  if (exists) {
    throw new CustomError("Email already registered with another account", 400);
  }

  const gstExists = await sellerModel.findOne({ gstNumber });
  if (gstExists) {
    throw new CustomError("GST already registered", 400);
  }

  await sellerModel.create({
    name,
    email,
    mobile,
    shopName,
    gstNumber, // Still required by Zod schema
    TermsAndCdn,
    password,
    gstCertificate: gstCertificateData, // Will be null if no file was uploaded
    verified: "pending",
  });

  res.status(201).json({
    success: true,
    message: "You are ready to sell.",
  });
});

// ------------------------------ LOGOUT FUNCTION --------------------------------
export const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ------------------------------ FORGOT PASSWORD --------------------------------
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email, role } = req.body; // <-- Extract role here

  if (!email || !role) {
    throw new CustomError("Email and Role are required", 400);
  }

  let user;
  if (role === "user") {
    user = await userModel.findOne({ email });
  } else if (role === "seller") {
    user = await sellerModel.findOne({ email });
  } else if (role === "admin") {
    user = await adminModel.findOne({ email });
  }

  if (!user) {
    throw new CustomError(`No ${role} account found with this email`, 404);
  }

  // 3. Generate the JWT using the role they requested
  const resetToken = jwt.sign(
    { id: user._id, role: role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  const protocol = req.headers["x-forwarded-proto"] || req.protocol;

  const host = req.get("host");

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `${protocol}://${host}`
      : process.env.FRONTEND_URL;

  const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

  

  // 4. Send the email
  await sendEmail(
    user.email,
    "Password Reset Request - MartXpress",
    resetPasswordTemplate(user.email, resetUrl),
  );

  res.status(200).json({
    success: true,
    message: "Password reset link sent to your email",
  });
});

// ------------------------------ RESET PASSWORD --------------------------------
export const resetPassword = asyncHandler(async (req, res) => {
  // Token comes from the URL parameters (e.g., /api/auth/reset-password/:token)
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    throw new CustomError("Please provide both password fields", 400);
  }

  if (newPassword !== confirmPassword) {
    throw new CustomError("Passwords do not match", 400);
  }

  try {
    // 1. Verify the token (This will throw an error if expired or invalid)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2. Find the user based on the decoded role and ID
    let user;
    if (decoded.role === "user") {
      user = await userModel.findById(decoded.id).select("+password");
    } else if (decoded.role === "seller") {
      user = await sellerModel.findById(decoded.id).select("+password");
    } else if (decoded.role === "admin") {
      user = await adminModel.findById(decoded.id).select("+password");
    }

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    // 3. Update the password
    user.password = newPassword;

    // 4. Save the user (Your pre-save hook in the schema will hash the new password)
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    // Catch JWT verification errors specifically
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw new CustomError("Invalid or expired password reset link", 400);
    }
    throw error;
  }
});
