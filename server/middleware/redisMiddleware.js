import { getCache, setCache } from "../utils/cacheUtils.js";
import redisClient from "../config/redisClient.js"; // Required for clearing the cache

export const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    // 1. Only cache GET requests (never cache POST, PUT, DELETE)
    if (req.method !== "GET") return next();

    // 2. CRITICAL SECURITY FIX: Add userId to the key to prevent data leaks
    const userId = req.user ? req.user.id || req.user.sub : "public";
    const key = `cache:${userId}:${req.originalUrl}`;

    try {
      const cachedData = await getCache(key);

      // CACHE HIT → return immediately
      if (cachedData) {
        console.log(`Redis Hit: ${key}`.cyan);
        return res.status(200).json(cachedData);
      }

      console.log(`Redis Miss: ${key}`.yellow);

      const originalJson = res.json.bind(res);

      res.json = (body) => {
        // Only cache successful requests
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(key, body, ttl);
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Redis Middleware Error:", error);
      next(); // If Redis fails, just continue without caching
    }
  };
};

/**
 * Utility to clear specific cache patterns when data is updated/deleted
 * Example: await clearCachePattern("/api/products");
 */
export const clearCachePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(
        `🧹 Cleared ${keys.length} cache keys for pattern: ${pattern}`.magenta,
      );
    }
  } catch (err) {
    console.error("Redis Cache Clear Error:", err);
  }
};
