import { Redis } from "@upstash/redis";

// Create a Redis instance using env vars
export const redis = new Redis({

  

  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});



