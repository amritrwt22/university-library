import { Redis } from "@upstash/redis";
import config from "@/lib/config";

const redis = new Redis({
  url: config.env.upstash.redisUrl,
  token: config.env.upstash.redisToken,
});

export default redis;

// this file creates a Redis client using Upstash's Redis service
// similar to prisma client or drizzle client, this is used to interact with Redis database
