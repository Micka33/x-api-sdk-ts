/**
 * Information about a rate limit.
 */
export interface RateLimitInfo {
  /** The limit for the endpoint */
  limit: number;
  
  /** The remaining requests for the endpoint */
  remaining: number;
  
  /** The time when the rate limit resets */
  reset: Date;
}

/**
 * Parses rate limit headers from a Twitter API response.
 * 
 * @param headers - The response headers
 * @returns Rate limit information or undefined if not available
 */
export function parseRateLimitHeaders(headers: Record<string, string>): RateLimitInfo | undefined {
  const limit = headers['x-rate-limit-limit'];
  const remaining = headers['x-rate-limit-remaining'];
  const reset = headers['x-rate-limit-reset'];

  if (!limit || !remaining || !reset) {
    return undefined;
  }

  return {
    limit: parseInt(limit, 10),
    remaining: parseInt(remaining, 10),
    reset: new Date(parseInt(reset, 10) * 1000),
  };
}

/**
 * Checks if a rate limit has been exceeded.
 * 
 * @param rateLimitInfo - The rate limit information
 * @returns Whether the rate limit has been exceeded
 */
export function isRateLimitExceeded(rateLimitInfo?: RateLimitInfo): boolean {
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
export function getTimeUntilReset(rateLimitInfo?: RateLimitInfo): number {
  if (!rateLimitInfo) {
    return 0;
  }

  const now = new Date();
  return Math.max(0, rateLimitInfo.reset.getTime() - now.getTime());
}
