import type { IOAuth2Auth, IOAuth2Config } from 'interfaces/auth/IOAuth2Auth';

/**
 * Implementation of OAuth 2.0 authentication for Twitter API v2.
 */
export class OAuth2Auth implements IOAuth2Auth {
  private bearerToken: string;

  /**
   * Creates a new OAuth2Auth instance.
   *
   * @param config - The OAuth 2.0 configuration
   */
  constructor(private config: IOAuth2Config) {
    if (!config.bearerToken && (!config.clientId || !config.clientSecret)) {
      throw new Error('OAuth2Auth requires either a bearer token or a client ID and client secret');
    }

    this.bearerToken = config.bearerToken || '';
  }

  /**
   * Generates authentication headers for a Twitter API request.
   *
   * @param url - The full URL of the request
   * @param method - The HTTP method (GET, POST, etc.)
   * @param params - Optional parameters for the request
   * @returns A promise that resolves to the authentication headers
   */
  async getHeaders(): Promise<{ Authorization: string }> {
    if (!this.bearerToken) {
      // If we don't have a bearer token but have client credentials, we should get a token
      if (this.config.clientId && this.config.clientSecret) {
        await this.getBearerToken();
      } else {
        throw new Error('OAuth2Auth requires a bearer token or client credentials');
      }
    }

    return {
      Authorization: `Bearer ${this.bearerToken}`,
    };
  }

  /**
   * Gets a bearer token using client credentials.
   *
   * @returns A promise that resolves when the bearer token is obtained
   */
  private async getBearerToken(): Promise<void> {
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('Client ID and client secret are required to get a bearer token');
    }
    // In a real implementation, this would make a request to the Twitter API to get a bearer token
    // For now, we'll just throw an error
    throw new Error('Getting a bearer token from client credentials is not implemented yet');
  }
}
