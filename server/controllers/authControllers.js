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
