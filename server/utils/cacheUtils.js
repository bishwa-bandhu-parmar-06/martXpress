// // cacheUtils.js
// import {redisClient} from "../config/redisClient.js";

// // ✅ Cache se data laane ka function
// export const getCache = async (key) => {
//   const data = await redisClient.get(key);
//   return data ? JSON.parse(data) : null;
// };

// // ✅ Cache me data save karne ka function
// export const setCache = async (key, value, ttl = 60) => {
//   await redisClient.setEx(key, ttl, JSON.stringify(value)); // ttl = seconds
// };

// // ✅ Cache delete karne ka function (jab data update/delete ho)
// export const deleteCache = async (key) => {
//   await redisClient.del(key);
// };
