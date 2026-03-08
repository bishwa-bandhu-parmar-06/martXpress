import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 1. Get the port from your environment variables, default to 587
const smtpPort = Number(process.env.SMTP_PORT) || 587;

// 2. Set 'secure' to true ONLY if the port is 465
const isSecure = smtpPort === 465;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: smtpPort,
  secure: isSecure, // <-- This is the crucial change!
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Failed:", error);
  } else {
    // Also updated this log so you can see which port it actually connected to!
    console.log(
      `Brevo SMTP Connected Successfully on port ${smtpPort}!`.green.bold,
    );
  }
});

export default transporter;
