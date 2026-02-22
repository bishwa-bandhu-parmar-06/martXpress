import jwt from "jsonwebtoken"

export const generateToken = (payload) => {
  return jwt.sign(
    {
      sub: payload.id,
      role: payload.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
      issuer: "martxpress-app",
    },
  );
};
