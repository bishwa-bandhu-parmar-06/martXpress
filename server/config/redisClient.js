import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL;
// console.log("Redis Url : ", redisUrl);
const redisClient = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: (retries) => {
      // Reconnect after 100ms, 200ms, etc. up to 2 seconds
      return Math.min(retries * 100, 2000);
    },
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error:", err));
redisClient.on("connect", () => console.log("Redis Cloud: Connected"));

// Start the connection
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Could not connect to Redis Cloud:", err);
  }
})();

export default redisClient;
