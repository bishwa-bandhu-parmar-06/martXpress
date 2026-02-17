import { createClient } from "redis";
const redisUrl = process.env.REDIS_URL;
export const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

await redisClient.connect();
