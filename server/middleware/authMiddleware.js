import jwt from "jsonwebtoken";
import {CustomError} from "../utils/customError.js"; // <-- Make sure this path is correct!

/* -------------------------- Verify any valid token -------------------------- */
export const verifyToken = (req, res, next) => {
  try {
    let token = null;

    if (req.cookies?.token) {
      token = req.cookies.token;
    }
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new CustomError(
        "Unauthorized: Please log in to access this resource.",
        401,
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

/* -------------------------- Verify Role Access Only -------------------------- */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new CustomError(
          `Access denied. Allowed roles: ${allowedRoles.join(", ")}`,
          403,
        ),
      );
    }

    next();
  };
};
