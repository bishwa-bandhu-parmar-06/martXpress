import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redisClient.js";

export const cartLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,               // 20 cart actions / minute

  keyGenerator: (req) => {
    // ✅ user-based limit (best)
    if (req.user?.id) return `user:${req.user.id}`;

    // ✅ IPv4 + IPv6 safe IP limiter
    return rateLimit.ipKeyGenerator(req);
  },

  message: {
    status: 429,
    message: "Too many cart actions. Please slow down.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});
