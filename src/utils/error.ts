/**
 * Base class for Twitter API errors.
 */
export class TwitterError extends Error {
  /**
   * Creates a new TwitterError instance.
   * 
   * @param message - The error message
   * @param code - The error code
   */
  constructor(message: string, public code?: number) {
    super(message);
    this.name = 'TwitterError';
    Object.setPrototypeOf(this, TwitterError.prototype);
  }
}

/**
 * Error thrown when the Twitter API returns an error.
 */
export class TwitterAPIError extends TwitterError {
  /**
   * Creates a new TwitterAPIError instance.
   * 
   * @param message - The error message
   * @param code - The error code
   * @param errors - Additional error details
   */
  constructor(
    message: string,
    code?: number,
    public errors?: Array<{ code: number; message: string }>
  ) {
    super(message, code);
    this.name = 'TwitterAPIError';
    Object.setPrototypeOf(this, TwitterAPIError.prototype);
  }
}

/**
 * Error thrown when the Twitter API rate limit is exceeded.
 */
export class RateLimitError extends TwitterError {
  /**
   * Creates a new RateLimitError instance.
   * 
   * @param message - The error message
   * @param resetTime - The time when the rate limit resets
   */
  constructor(message: string, public resetTime?: Date) {
    super(message, 429);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Error thrown when authentication fails.
 */
export class AuthenticationError extends TwitterError {
  /**
   * Creates a new AuthenticationError instance.
   * 
   * @param message - The error message
   */
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Parses an error response from the Twitter API.
 * 
 * @param error - The error object
 * @returns A TwitterError instance
 */
export function parseTwitterError(error: any): TwitterError {
  if (!error.response) {
    return new TwitterError(error.message || 'Unknown error');
  }

  const { status, data, headers } = error.response;

  // Check for rate limit errors
  if (status === 429) {
    const resetTime = headers['x-rate-limit-reset']
      ? new Date(parseInt(headers['x-rate-limit-reset'], 10) * 1000)
      : undefined;
    return new RateLimitError(
      'Twitter API rate limit exceeded',
      resetTime
    );
  }

  // Check for authentication errors
  if (status === 401) {
    return new AuthenticationError(
      data.error || data.errors?.[0]?.message || 'Authentication failed'
    );
  }

  // Handle standard Twitter API errors
  if (data.errors && Array.isArray(data.errors)) {
    return new TwitterAPIError(
      data.errors[0]?.message || 'Twitter API error',
      status,
      data.errors
    );
  }

  // Handle v2 API errors
  if (data.error) {
    return new TwitterAPIError(
      data.error.message || data.error,
      status,
      data.errors
    );
  }

  // Fallback for unknown errors
  return new TwitterError(
    'Twitter API error',
    status
  );
}
