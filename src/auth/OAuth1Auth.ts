import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import type {
  IOAuth1Config,
  IOAuth1Auth,
  IOAuth1Token,
  IOAuth1AuthorizationHeaders,
} from 'interfaces/auth/IOAuth1Auth';

/**
 * Implementation of OAuth 1.0a authentication for Twitter API v1.1.
 */
export class OAuth1Auth implements IOAuth1Auth {
  private oauth: OAuth;
  private token: IOAuth1Token | null = null;
  /**
   * Creates a new OAuth1Auth instance.
   *
   * @param config - The OAuth 1.0a configuration
   */
  constructor(private config: IOAuth1Config) {
    this.oauth = new OAuth({
      consumer: {
        key: this.config.apiKey,
        secret: this.config.apiSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function: (baseString: string, key: string) =>
        crypto.createHmac('sha1', key).update(baseString).digest('base64'),
    });
  }

  /**
   * Sets the OAuth 1.0a token for the instance.
   *
   * @param token - The OAuth 1.0a token
   * @returns The instance of OAuth1Auth. Useful for chaining methods.
   * @example
   * const auth = new OAuth1Auth({
   *   apiKey: 'your_api_key',
   *   apiSecret: 'your_api_secret',
   * });
   * const token = { key: 'your_oauth_token', secret: 'your_oauth_token_secret' }
   * auth.setToken(token).getHeaders('https://api.twitter.com/1.1/statuses/update.json', 'POST', { status: 'Hello, world!' });
   */
  setToken(token: IOAuth1Token) {
    this.token = token;
    return this;
  }

  /**
   * Generates authorization headers for a Twitter API request.
   *
   * @param url - The full URL of the request
   * @param method - The HTTP method (GET, POST, etc.)
   * @param params - Optional parameters for the request
   * @param token - Optional OAuth 1.0a token
   * @returns The authorization headers
   * @example
   * const auth = new OAuth1Auth({
   *   apiKey: 'your_api_key',
   *   apiSecret: 'your_api_secret',
   * });
   * const token = { key: 'your_oauth_token', secret: 'your_oauth_token_secret' }
   * auth.getAuthorizationHeaders('https://api.twitter.com/1.1/statuses/update.json', 'POST', { status: 'Hello, world!' });
   */
  getAuthorizationHeaders(
    url: string,
    method: string,
    params: Record<string, any> = {},
    token?: IOAuth1Token,
  ): IOAuth1AuthorizationHeaders {
    const requestData = {
      url,
      method,
      data: params,
    };
    const tokenToUse: IOAuth1Token = {
      key: token?.key || this.token?.key || '',
      secret: token?.secret || this.token?.secret || '',
    };
    // The return type of `authorize` is incomplete, so we cast it to the correct type
    const authData = this.oauth.authorize(requestData, tokenToUse) as unknown as IOAuth1AuthorizationHeaders;
    return authData;
  }

  /**
   * Generates authentication headers for a Twitter API request.
   *
   * @param url - The full URL of the request
   * @param method - The HTTP method (GET, POST, etc.)
   * @param params - Optional parameters for the request
   * @param token - Optional OAuth 1.0a token
   * @returns A promise that resolves to the authentication headers
   * @example
   * const auth = new OAuth1Auth({
   *   apiKey: 'your_api_key',
   *   apiSecret: 'your_api_secret',
   * });
   * const token = { key: 'your_oauth_token', secret: 'your_oauth_token_secret' }
   * auth.getAsAuthorizationHeader('https://api.twitter.com/1.1/statuses/update.json', 'POST', { status: 'Hello, world!' });
   */
  getAsAuthorizationHeader(
    url: string,
    method: string,
    params: Record<string, any> = {},
    token?: IOAuth1Token,
  ): { Authorization: string } {
    const authData = this.getAuthorizationHeaders(url, method, params, token);
    // @ts-expect-error The type `OAuth.Authorization` is incomplete, so we defined it to the correct type
    return this.oauth.toHeader(authData);
  }
}
