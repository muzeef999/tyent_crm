import { redis } from "@/lib/redis";

export async function saveOtpToRedis(key: string, otp: string ) {
  const redisKey = `otp_${key}`;
  const EXPIRE_SECONDS = 3 * 60; // 3 minutes
    console.log(`✅ OTP saved to Redis for key: ${redisKey}`);

  await redis.set(redisKey, otp, { ex: EXPIRE_SECONDS });
}

export async function getOtpFromRedis(key: string) {
  const redisKey = `otp_${key}`;
   const otp = await redis.get(redisKey);
  return otp;

}

export async function deleteOtpFromRedis(key: string) {
  const redisKey = `otp_${key}`;
  try {
    const result = await redis.del(redisKey);
    // redis.del returns the number of keys deleted
    return result > 0; // true if OTP was found & deleted, false otherwise
  } catch (error) {
    console.error(`Error deleting OTP from Redis for key: ${redisKey}`, error);
    return false;
  }
}