import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redisClient.js";

/**
 * 🚨 Place Order – VERY STRICT
 * Prevent payment/order abuse
 */
export const placeOrderLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  windowMs: 10 * 60 * 1000, // ⏱️ 10 minutes
  max: 3, // ❗ Only 3 orders per 10 minutes per user

  keyGenerator: (req) => req.user.id,

  message: {
    status: 429,
    message: "Too many order attempts. Please try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 📦 Read Orders – Moderate
 */
export const orderReadLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  }),

  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,

  keyGenerator: (req) => req.user.id,

  message: {
    status: 429,
    message: "Too many requests. Slow down.",
  },
});
