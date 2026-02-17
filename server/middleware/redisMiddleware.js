import { getCache, setCache } from "../utils/cacheUtils.js";

export const cacheMiddleware = (ttl = 3600) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;

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
        if (res.statusCode === 200) {
          setCache(key, body, ttl);
        }
        return originalJson(body);
      };

      next();
    } catch (error) {
      console.error("Redis Middleware Error:", error);
      next();
    }
  };
};
