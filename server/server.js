// Load environment variables from .env file
require("dotenv").config();

// External imports
const express = require("express");
const cors = require("cors");

// Internal imports
const connectDb = require("./database/dbConfig");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const sellersRoutes = require("./routes/sellers.routes");
const adminRoutes = require("./routes/admin.routes");

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Configuration
const whitelist = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // allow cookies if needed
};
app.use(cors(corsOptions));

// Connect to database
connectDb();

// API Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/sellers", sellersRoutes);
app.use("/admin", adminRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 Server is up and running!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
