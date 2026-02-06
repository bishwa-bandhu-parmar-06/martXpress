/**
 * =========================
 * ENV CONFIG
 * =========================
 * dotenv sabse upar load hota hai
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
import rateLimit from "express-rate-limit";
import colors from "colors";

/**
 * =========================
 * GRAPHQL IMPORTS
 * =========================
 */
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import depthLimit from "graphql-depth-limit";

/**
 * =========================
 * LOCAL IMPORTS
 * =========================
 */
import { typeDefs } from "./graphQl/typeDefs.js";
import { resolvers } from "./graphQl/resolvers.js";
import connectDB from "./config/dbConfig.js";
import { errorMiddleware } from "./middleware/error_middleware.js";

/**
 * =========================
 * ROUTES
 * =========================
 */
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
 * SECURITY & PERFORMANCE
 * =========================
 */

// Helmet → secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false, // React/Vite ke liye
    crossOriginEmbedderPolicy: false,
  }),
);

// Reverse proxy support (Render, Railway, Nginx)
app.set("trust proxy", 1);

// Gzip compression → faster responses
app.use(compression());

// Hide Express fingerprint
app.disable("x-powered-by");

/**
 * =========================
 * CORS CONFIG
 * =========================
 */
const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

/**
 * =========================
 * LOGGING
 * =========================
 */
app.use(morgan("dev"));

/**
 * =========================
 * RATE LIMITING
 * =========================
 */

// REST API protection
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

// GraphQL protection (DoS safe)
const graphQlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
});

app.use("/api", apiLimiter);

/**
 * =========================
 * DATABASE
 * =========================
 */
connectDB();

/**
 * =========================
 * GRAPHQL SERVER
 * =========================
 */
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== "production", // prod me disable
  validationRules: [depthLimit(5)], // query depth attack protection
});

await apolloServer.start();

/**
 * =========================
 * GRAPHQL MIDDLEWARE
 * =========================
 */
app.use(
  "/graphql",
  graphQlLimiter,
  bodyParser.json(),
  expressMiddleware(apolloServer),
);

/**
 * =========================
 * REST BODY PARSER
 * =========================
 */
app.use("/api", express.json());

/**
 * =========================
 * HEALTH CHECK
 * =========================
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});

/**
 * =========================
 * API ROUTES
 * =========================
 */
app.get("/", (req, res) => {
  res.send("martXpress Server is Running....");
});

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
 * FRONTEND SERVE (PRODUCTION)
 * =========================
 *  ALWAYS AFTER API ROUTES
 */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

/**
 * =========================
 * ERROR HANDLER (LAST)
 * =========================
 */
app.use(errorMiddleware);

/**
 * =========================
 * SERVER START
 * =========================
 */
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`.green.bold);
});
