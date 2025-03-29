import { IRateLimitInfo } from "../types/x-api/base_response";

/**
 * Parses rate limit headers from a Twitter API response.
 * 
 * @param headers - The response headers
 * @returns Rate limit information or undefined if not available
 */
export function parseRateLimitHeaders(headers: Record<string, string>): IRateLimitInfo | undefined {
  const limit = headers['x-rate-limit-limit'];
  const remaining = headers['x-rate-limit-remaining'];
  const reset = headers['x-rate-limit-reset'];

  const udlimit = headers['x-user-limit-24hour-limit'];
  const udremaining = headers['x-user-limit-24hour-remaining'];
  const udreset = headers['x-user-limit-24hour-reset'];

  return {
    limit: Number(limit),
    remaining: Number(remaining),
    reset: new Date(Number(reset) * 1000),
    user: {
      daily: {
        limit: Number(udlimit),
        remaining: Number(udremaining),
        reset: new Date(Number(udreset) * 1000),
      },
    },
  };
}

/**
 * Checks if a rate limit has been exceeded.
 * 
 * @param rateLimitInfo - The rate limit information
 * @returns Whether the rate limit has been exceeded
 */
export function isRateLimitExceeded(rateLimitInfo?: IRateLimitInfo): boolean {
  if (!rateLimitInfo) {
    return false;
  }

  return rateLimitInfo.remaining <= 0;
}

/**
 * Calculates the time until a rate limit resets.
 * 
 * @param rateLimitInfo - The rate limit information
 * @returns The time until the rate limit resets in milliseconds
 */
export function getTimeUntilReset(rateLimitInfo?: IRateLimitInfo): number {
  if (!rateLimitInfo) {
    return 0;
  }

  const now = new Date();
  return Math.max(0, rateLimitInfo.reset.getTime() - now.getTime());
}
