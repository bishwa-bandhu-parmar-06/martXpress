import jwt from "jsonwebtoken";

/* -------------------------- Verify any valid token -------------------------- */
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res
        .status(200)
        .json({ status: 401, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should contain id, role, email, etc.
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/* -------------------------- Verify Admin Access Only -------------------------- */
export const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

/* -------------------------- Verify Seller Access Only -------------------------- */
export const verifySeller = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Sellers only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

/* -------------------------- Verify User Access Only -------------------------- */
export const verifyUser = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== "user") {
      return res.status(403).json({ message: "Access denied. Users only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
