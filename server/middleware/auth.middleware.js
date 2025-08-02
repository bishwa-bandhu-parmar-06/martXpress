// const jwt = require("jsonwebtoken");
// const userModel = require("../models/users.model");
// const sellerModel = require("../models/sellers.model");
// const adminModel = require("../models/admin.model");

// const roleModelMap = {
//   users: userModel,
//   sellers: sellerModel,
//   admin: adminModel,
// };

// const verifyToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { userId, role } = decoded;

//     const Model = roleModelMap[role];
//     if (!Model) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid role in token",
//       });
//     }

//     const user = await Model.findById(userId).select("-password");
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     req.user = user;
//     req.role = role;
//     req.userId = userId;

//     next();
//   } catch (error) {
//     console.error("Token verification error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };

// module.exports = verifyToken;



const userModel = require("../models/users.model");
const sellerModel = require("../models/sellers.model");
const adminModel = require("../models/admin.model");

const roleModelMap = {
  users: userModel,
  sellers: sellerModel,
  admin: adminModel,
};

const verifySession = async (req, res, next) => {
  try {
    const { userId, role } = req.session;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const Model = roleModelMap[role];
    if (!Model) {
      return res.status(403).json({
        success: false,
        message: "Invalid role in session",
      });
    }

    const user = await Model.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.userId = userId;
    req.role = role;

    next();
  } catch (error) {
    console.error("Session verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = verifySession;
