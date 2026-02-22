import { z } from "zod";

// it is for admin and users
export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain a special character"),
});

export const sellerRegisterSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name too long")
    .trim(),

  email: z.string().trim().toLowerCase().email("Invalid email format"),

  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  shopName: z
    .string()
    .min(2, "Shop name too short")
    .max(100, "Shop name too long")
    .trim(),

  gstNumber: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      "Invalid GST number",
    ),

  // Instead of the union, you can use z.coerce
  TermsAndCdn: z.coerce.boolean().refine((val) => val === true, {
    message: "Please accept Terms & Conditions",
  }),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password too long")
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[a-z]/, "Must contain lowercase letter")
    .regex(/[@$!%*?&]/, "Password must contain a special character")
    .regex(/[0-9]/, "Must contain number"),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});
