import OAuth from 'oauth-1.0a';
import crypto from 'crypto';
import { IAuth } from '../interfaces/IAuth';

/**
 * Configuration for OAuth 1.0a authentication.
 */
export interface OAuth1Config {
  /** The API key (consumer key) */
  apiKey: string;
  
  /** The API secret (consumer secret) */
  apiSecret: string;
  
  /** The access token */
  accessToken?: string;
  
  /** The access token secret */
  accessTokenSecret?: string;
}

/**
 * Implementation of OAuth 1.0a authentication for Twitter API v1.1.
 */
export class OAuth1Auth implements IAuth {
  private oauth: OAuth;
  private credentials: {
    key: string;
    secret: string;
  };
  private token?: {
    key: string;
    secret: string;
  };

  /**
   * Creates a new OAuth1Auth instance.
   * 
   * @param config - The OAuth 1.0a configuration
   */
  constructor(private config: OAuth1Config) {
    this.oauth = new OAuth({
      consumer: {
        key: config.apiKey,
        secret: config.apiSecret,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(baseString: string, key: string) {
        return crypto
          .createHmac('sha1', key)
          .update(baseString)
          .digest('base64');
      },
    });

    this.credentials = {
      key: config.apiKey,
      secret: config.apiSecret,
    };

    if (config.accessToken && config.accessTokenSecret) {
      this.token = {
        key: config.accessToken,
        secret: config.accessTokenSecret,
      };
    }
  }

  /**
   * Generates authentication headers for a Twitter API request.
   * 
   * @param url - The full URL of the request
   * @param method - The HTTP method (GET, POST, etc.)
   * @param params - Optional parameters for the request
   * @returns A promise that resolves to the authentication headers
   */
  async getHeaders(
    url: string,
    method: string,
    params?: Record<string, any>
  ): Promise<{Authorization: string}> {
    if (!this.token) {
      throw new Error('OAuth1Auth requires access token and access token secret');
    }

    const requestData = {
      url,
      method,
      data: params || {},
    };

    const authData = this.oauth.authorize(requestData, this.token);
    return this.oauth.toHeader(authData) as OAuth.Header;
  }
} 