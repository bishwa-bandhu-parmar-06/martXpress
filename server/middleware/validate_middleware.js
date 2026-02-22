export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    // Pass the error to your global errorMiddleware instead of handling it here
    next(error);
  }
};
