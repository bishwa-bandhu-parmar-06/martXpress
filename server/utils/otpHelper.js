import otpGenerator from "otp-generator";
import otpModel from "../models/otpModel.js";
import { sendEmail } from "../email/sendemail.js";
import { otpTemplate } from "../email/templates/otpTemplates.js";

export async function generateAndSendOtp(userId, role, email, name = "") {
  if (!email || !role) {
    throw new Error("Email and Role are required");
  }

  // ✅ Generate OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  console.log("Generated OTP:", otp);

  // ✅ Remove old OTPs for this email + role
  await otpModel.deleteMany({ email, role });

  // ✅ Save OTP in DB
  await otpModel.create({
    userId,
    role, // user | seller | admin
    email,
    otp,
    otpExpiry: Date.now() + 10 * 60 * 1000, // 10 min expiry
  });

  // ✅ Send Email
  const subject = "OTP for martXpress";
  await sendEmail(email, subject, otpTemplate(name || email, otp));

  return;
}
