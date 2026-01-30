import userModel from "../models/usersModel.js";
import sellerModel from "../models/sellersModel.js";
import adminModel from "../models/adminModel.js";
import otpModel from "../models/otpModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { generateAndSendOtp } from "../utils/otpHelper.js";

// Update your loginUsers function in backend

export const login = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("From Frontend : ", email)
    if (!email) {
      return res.status(200).json({
        status: 400,
        message: "Email is required",
      });
    }

    let user = await userModel.findOne({ email });
    let role = "user";

    if (!user) {
      user = await sellerModel.findOne({ email });
      role = "seller";
    }

    if (!user) {
      user = await adminModel.findOne({ email });
      role = "admin";
    }

    if (!user) {
      return res.status(200).json({
        status: 404,
        message: "Email does not exist",
      });
    }

    // ✅ ONLY send OTP (NO STATUS CHECK)
    await generateAndSendOtp(user._id, role, email, user.name);

    return res.status(200).json({
      status: 200,
      message: "OTP sent to your email",
      role,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(200).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// export const verifyLoginOtp = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(200).json({
//         status: 400,
//         message: "Email and OTP are required",
//       });
//     }

//     const existingOtp = await otpModel.findOne({ email, otp });
//     if (!existingOtp) {
//       return res.status(200).json({
//         status: 400,
//         message: "Invalid Email or OTP",
//       });
//     }

//     if (existingOtp.otpExpiry < Date.now()) {
//       await otpModel.deleteOne({ _id: existingOtp._id });
//       return res.status(200).json({
//         status: 410,
//         message: "OTP Expired",
//       });
//     }

//     let user;
//     const role = existingOtp.role;

//     if (role === "user") user = await userModel.findById(existingOtp.userId);
//     if (role === "seller")
//       user = await sellerModel.findById(existingOtp.userId);
//     if (role === "admin") user = await adminModel.findById(existingOtp.userId);

//     if (!user) {
//       return res.status(200).json({
//         status: 404,
//         message: "User not found",
//       });
//     }

//     // Cleanup OTP
//     await otpModel.findByIdAndDelete(existingOtp._id);

//     // 🔐 Generate JWT
//     const token = jwt.sign(
//       { id: user._id, role, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.status(200).json({
//       status: 200,
//       message: "Login successful",
//       token,
//       user,
//       role,
//     });
//   } catch (error) {
//     console.error("Verify login OTP error:", error);
//     return res.status(200).json({
//       status: 500,
//       message: "Internal Server Error",
//     });
//   }
// };

export const registerUsers = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUsers =
      (await userModel.findOne({ email })) ||
      (await sellerModel.findOne({ email })) ||
      (await adminModel.findOne({ email }));

    if (existingUsers) {
      return res
        .status(200)
        .json({ status: 400, message: "Email Already Exists." });
    }

    const newUsers = new userModel({ email });
    await newUsers.save();

    await generateAndSendOtp(newUsers._id, "user", email);

    return res
      .status(200)
      .json({ status: 200, message: "Otp Sent to your email." });
  } catch (error) {
    console.error("Error while Registering Users Profile:", error);
    res.status(200).json({ status: 500, message: error.message });
  }
};

// ---------------------- REGISTER ADMIN ----------------------
export const registerAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    const existingUsers =
      (await userModel.findOne({ email })) ||
      (await sellerModel.findOne({ email })) ||
      (await adminModel.findOne({ email }));

    if (existingUsers) {
      return res
        .status(200)
        .json({ status: 400, message: "Email Already Exists." });
    }

    const newAdmin = new adminModel({ email });
    await newAdmin.save();

    await generateAndSendOtp(newAdmin._id, "admin", email);

    return res
      .status(200)
      .json({ status: 200, message: "Otp Sent to your email." });
  } catch (error) {
    console.error("Error while Registering Admin Profile:", error);
    res.status(200).json({ status: 500, message: error.message });
  }
};

export const registerSeller = async (req, res) => {
  try {
    const { name, email, mobile, shopName, gstNumber, TermsAndCdn } = req.body;
    const gstCertificate = req.file;

    if (!name || !email || !mobile || !shopName || !gstNumber) {
      return res.status(200).json({
        status: 400,
        message: "All fields are required",
      });
    }

    if (!(TermsAndCdn === true || TermsAndCdn === "true")) {
      return res.status(200).json({
        status: 400,
        message: "Please agree to Terms & Conditions",
      });
    }

    const exists =
      (await userModel.findOne({ email })) ||
      (await adminModel.findOne({ email })) ||
      (await sellerModel.findOne({ email })) ||
      (await sellerModel.findOne({ gstNumber }));

    if (exists) {
      return res.status(200).json({
        status: 400,
        message: "Email or GST already exists",
      });
    }

    const seller = await sellerModel.create({
      name,
      email,
      mobile,
      shopName,
      gstNumber,
      TermsAndCdn,
      verified: "pending",
    });

    await generateAndSendOtp(seller._id, "seller", email, name);

    return res.status(200).json({
      status: 200,
      message: "OTP sent to your email. Please verify to continue.",
    });
  } catch (error) {
    console.error("Register seller error:", error);
    return res.status(200).json({
      status: 500,
      message: error.message,
    });
  }
};

// ---------------------- VERIFY REGISTER OTP ----------------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const existingOtp = await otpModel.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(200).json({
        status: 400,
        message: "Invalid Email or OTP",
      });
    }

    if (existingOtp.otpExpiry < Date.now()) {
      await otpModel.findByIdAndDelete(existingOtp._id);
      return res.status(200).json({
        status: 410,
        message: "OTP Expired",
      });
    }

    let user;
    const role = existingOtp.role;

    if (role === "user") user = await userModel.findById(existingOtp.userId);
    if (role === "seller") user = await sellerModel.findById(existingOtp.userId);
    if (role === "admin") user = await adminModel.findById(existingOtp.userId);

    if (!user) {
      return res.status(200).json({
        status: 404,
        message: "User not found",
      });
    }

    // ✅ Email verified
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await user.save();
    }

    // 🔴 SELLER STATUS CHECK (ONLY HERE)
    if (role === "seller") {
      if (user.verified === "pending") {
        return res.status(200).json({
          status: 403,
          message: "Your profile is under admin review.",
        });
      }

      if (user.verified === "rejected") {
        return res.status(200).json({
          status: 403,
          message: "Your profile is rejected. Please contact admin support.",
        });
      }
    }

    // Cleanup OTP
    await otpModel.findByIdAndDelete(existingOtp._id);

    // 🔐 Generate token ONLY if allowed
    const token = jwt.sign(
      { id: user._id, role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      status: 200,
      message: "Verification successful",
      token,
      role,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(200).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user, role;

    user = await userModel.findOne({ email });
    if (user) role = "user";

    if (!user) {
      user = await sellerModel.findOne({ email });
      if (user) role = "seller";
    }

    if (!user) {
      user = await adminModel.findOne({ email });
      if (user) role = "admin";
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found with this email",
      });
    }

    await otpModel.deleteMany({ email });
    await generateAndSendOtp(user._id, role, email, user.name);

    return res.status(200).json({
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to resend OTP",
    });
  }
};
