export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // --- PRODUCTION-READY ERROR MAPPING ---
  // These catch common issues and give them proper status codes/messages

  // 1. Mongoose Bad ID (CastError)
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // 2. Mongoose Duplicate Key (Unique Constraint)
  if (err.code === 11000) {
    message = `${Object.keys(err.keyValue)} already exists.`;
    statusCode = 400;
  }

  // 3. Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    statusCode = 400;
  }

  // 4. JWT Errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token. Please log in again.";
    statusCode = 401;
  }
  // 5. Zod Validation Errors
  if (err.name === "ZodError" || err.issues) {
    // Zod stores its error array in err.issues or err.errors
    const zodErrors = err.issues || err.errors;
    message = zodErrors.map((issue) => issue.message).join(", ");
    statusCode = 400;
  }
  // --- Multer File Upload Errors ---
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File is too large. Maximum size allowed is 5MB.";
    } else {
      message = err.message;
    }
    statusCode = 400;
  }

  // Also catch the custom Error we threw in the fileFilter
  if (
    err.message ===
    "Invalid file type. Only PDF, JPG, JPEG, and PNG are allowed."
  ) {
    message = err.message;
    statusCode = 400;
  }

  if (err.name === "TokenExpiredError") {
    message = "Token expired. Please log in again.";
    statusCode = 401;
  }

  // --- RESPONSE LOGIC ---
  const isDev = process.env.NODE_ENV === "development";

  res.status(statusCode).json({
    success: false,
    message: isDev
      ? message
      : statusCode === 500
        ? "Internal Server Error"
        : message,
    // Only send the technical details if we are in development
    ...(isDev && {
      stack: err.stack,
      errorDetails: err,
    }),
  });
};
