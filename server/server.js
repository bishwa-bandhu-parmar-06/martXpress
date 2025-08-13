// Load environment variables from .env file
require("dotenv").config();

const session = require("express-session");
const cookieParser = require("cookie-parser");

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

// ✅ 1. CORS must be first to handle cookies from frontend/postman
const whitelist = ["http://localhost:5173"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies from frontend
};
app.use(cors(corsOptions));

// ✅ 2. Cookie parser before session
app.use(cookieParser());

// ✅ 3. Body parser
app.use(express.json());

// ✅ 4. Session middleware (AFTER CORS, cookieParser, json)
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY, // strong random string in .env
    resave: false, // only save if session data changed
    saveUninitialized: false, // don't save empty sessions
    cookie: {
      maxAge: 60 * 60 * 1000, // 1 hour (in milliseconds)
      httpOnly: true, // JS se access nahi hoga
      secure: false, // localhost ke liye false, production me true
      sameSite: "lax", // basic CSRF protection
    },
  })
);

// ✅ 5. Connect DB
connectDb();

// ✅ 6. API Routes
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/sellers", sellersRoutes);
app.use("/admin", adminRoutes);

// ✅ 7. Default route
app.get("/", (req, res) => {
  res.send("🚀 Server is up and running!");
});

// ✅ 8. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
