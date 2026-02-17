// utils/cacheUtils.js
import redisClient from "../config/redisClient.js";

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Redis Get Error:", err);
    return null;
  }
};

export const setCache = async (key, value, ttl = 3600) => {
  try {
    // ttl is in seconds, default 1 hour
    await redisClient.set(key, JSON.stringify(value), { EX: ttl });
  } catch (err) {
    console.error("Redis Set Error:", err);
  }
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error("Redis Delete Error:", err);
  }
};
