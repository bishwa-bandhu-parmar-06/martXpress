export const errorMiddleware = (error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "BACKEND ERROR FROM ERROR MIDDLEWARE";
  const extraDetails = error.extraDetails || "error from backend";

  return res.status(status).json({ message: message, extraDetails });
};
