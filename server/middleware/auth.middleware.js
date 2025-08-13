

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
    // ✅ Access nested session.user object
    const userSession = req.session.user;

    if (!userSession || !userSession.id || !userSession.role) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const { id: userId, role } = userSession;
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
