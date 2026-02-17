/**
 * =========================
 * ENV CONFIG
 * =========================
 */
import dotenv from "dotenv";
dotenv.config();

/**
 * =========================
 * CORE IMPORTS
 * =========================
 */
import path from "path";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import colors from "colors";

/**
 * =========================
 * LOCAL IMPORTS
 * =========================
 */
import connectDB from "./config/dbConfig.js";
import { errorMiddleware } from "./middleware/error_middleware.js";

import authRoutes from "./routes/autRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import sellerRoutes from "./routes/sellersRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import webRoutes from "./routes/webRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";

/**
 * =========================
 * APP INIT
 * =========================
 */
const app = express();
const port = process.env.PORT || 8080;
const __dirname = path.resolve();

/**
 * =========================
 * DATABASE
 * =========================
 */
connectDB();

/**
 * =========================
 * SECURITY
 * =========================
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(compression());
app.disable("x-powered-by");
app.set("trust proxy", 1);

/**
 * =========================
 * CORS
 * =========================
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */
app.use(morgan("dev"));
app.use(express.json());

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
  });
});

/**
 * =========================
 * API ROUTES
 * =========================
 */
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/sellers/products", productRoutes);
app.use("/api", webRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/rating", ratingRoutes);

/**
 * =========================
 * FRONTEND SERVE
 * =========================
 * Express 5 Safe Fallback
 */
app.use(express.static(path.join(__dirname, "client/dist")));

// SPA fallback (VERY IMPORTANT)
app.use((req, res) => {
  res.sendFile(
    path.resolve(__dirname, "client", "dist", "index.html")
  );
});

/**
 * =========================
 * ERROR HANDLER (ALWAYS LAST)
 * =========================
 */
app.use(errorMiddleware);

/**
 * =========================
 * SERVER START
 * =========================
 */
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`.green.bold);
});
