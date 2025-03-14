/**
 * Configuration for OAuth 1.0a authentication.
 */
export interface IOAuth1Config {
  /** The API key (consumer key) */
  apiKey: string;
  /** The API secret (consumer secret) */
  apiSecret: string;
}

/**
 * Headers for OAuth 1.0a authentication.
 */

export type IOAuth1AuthorizationHeaders = {
  oauth_consumer_key: string;
  oauth_nonce: string;
  oauth_signature_method: string;
  oauth_timestamp: string;
  oauth_version: string;
  oauth_signature: string;
};

/**
 * Token for OAuth 1.0a authentication.
 */
export type IOAuth1Token = {
  key: string;
  secret: string;
};

export interface IOAuth1Auth {
  /**
   * Sets the OAuth 1.0a token for the instance.
   *
   * @param token - The OAuth 1.0a token
   * @returns The instance of OAuth1Auth
   * @example
   * const auth = new OAuth1Auth({
   *   apiKey: 'your_api_key',
   *   apiSecret: 'your_api_secret',
   * });
   * const token = { key: 'your_oauth_token', secret: 'your_oauth_token_secret' }
   * auth.setToken(token).getHeaders('https://api.twitter.com/1.1/statuses/update.json', 'POST', { status: 'Hello, world!' });
   */
  setToken(token: IOAuth1Token): this;

  /**
   * Generates authorization headers for a Twitter API request.
   *
   * @param url - The full URL of the request
   * @param method - The HTTP method (GET, POST, etc.)
   * @param params - Optional parameters for the request
   * @param token - Optional OAuth 1.0a token
   * @returns The authorization headers
   */
  getAuthorizationHeaders(
    url: string,
    method: string,
    params?: Record<string, any>,
    token?: IOAuth1Token,
  ): IOAuth1AuthorizationHeaders;

  /**
   * Generates authentication headers for a Twitter API request.
   *
   * @param url - The full URL of the request
   * @param method - The HTTP method (GET, POST, etc.)
   * @param params - Optional parameters for the request
   * @param token - Optional OAuth 1.0a token
   * @returns An object containing the authentication headers
   */
  getAsAuthorizationHeader(
    url: string,
    method: string,
    params?: Record<string, any>,
    token?: IOAuth1Token,
  ): { Authorization: string };
}
