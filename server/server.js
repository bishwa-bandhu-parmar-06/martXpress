import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";

import { typeDefs } from "./graphQl/typeDefs.js";
import { resolvers } from "./graphQl/resolvers.js";

import rateLimit from "express-rate-limit";
import colors from "colors";
import connectDB from "./config/dbConfig.js";

const app = express();
const port = process.env.PORT || 8080;

// importing all routes here
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
import { errorMiddleware } from "./middleware/error_middleware.js";

/* =========================
   GLOBAL MIDDLEWARES
========================= */

// ❌ Not using globally because GraphQL needs its own body parser
// app.use(express.json());

app.use(helmet()); // security headers

const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(morgan("dev")); // logging

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

/* =========================
   DATABASE CONNECTION
========================= */
connectDB();

/* =========================
   APOLLO GRAPHQL SETUP
========================= */
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  context: async ({ req }) => {
    // GraphQL auth token access
    const token = req?.headers?.authorization || "";
    return { token };
  },
});

await apolloServer.start();

/* =========================
   GRAPHQL MIDDLEWARE
   (bodyParser REQUIRED here)
========================= */
app.use(
  "/graphql",
  bodyParser.json(),
  expressMiddleware(apolloServer)
);


/* =========================
   REST API BODY PARSER
========================= */
app.use("/api", express.json()); // ✅ REST APIs safe

/* =========================
   ROUTES
========================= */
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

/* =========================
   ERROR HANDLER
========================= */
app.use(errorMiddleware);

/* =========================
   SERVER START
========================= */
app.listen(port, () => {
  console.log(
    `Server is running on port : http://localhost:${port}`.green.bold
  );
});
