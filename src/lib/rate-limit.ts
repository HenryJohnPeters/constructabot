import { NextRequest } from "next/server";
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
});

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export async function rateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{
  success: boolean;
  remainingRequests?: number;
  resetTime?: number;
}> {
  const key = `ratelimit:${identifier}`;
  const window = Math.floor(Date.now() / config.windowMs);
  const windowKey = `${key}:${window}`;

  try {
    const current = await redis.incr(windowKey);

    if (current === 1) {
      await redis.expire(windowKey, Math.ceil(config.windowMs / 1000));
    }

    if (current > config.maxRequests) {
      const ttl = await redis.ttl(windowKey);
      return {
        success: false,
        remainingRequests: 0,
        resetTime: Date.now() + ttl * 1000,
      };
    }

    return {
      success: true,
      remainingRequests: config.maxRequests - current,
      resetTime:
        Date.now() + (config.windowMs - (Date.now() % config.windowMs)),
    };
  } catch (error) {
    console.error("Rate limit error:", error);
    // Fail open - allow request if Redis is down
    return { success: true };
  }
}

export const RATE_LIMITS = {
  // Per user limits
  USER_JOBS: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 jobs per minute
  USER_API: { windowMs: 60 * 1000, maxRequests: 60 }, // 60 API calls per minute

  // Per organization limits
  ORG_JOBS: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 jobs per minute per org
  ORG_API: { windowMs: 60 * 1000, maxRequests: 1000 }, // 1000 API calls per minute per org
};
