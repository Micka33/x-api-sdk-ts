import type { IOAuth2Auth, IOAuth2Config, IOAuth2Token } from 'interfaces/auth/IOAuth2Auth';

/**
 * Implementation of OAuth 2.0 authentication for Twitter API v2.
 */
export class OAuth2Auth implements IOAuth2Auth {
  private clientId: string;
  private clientSecret?: string;
  private accessToken: string | null;
  private refreshToken: string | null;
  private tokenExpiresAt: number | null;

  constructor(config: IOAuth2Config) {
    if (!config.clientId) {
      throw new Error('OAuth2Auth requires a client ID');
    }
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.accessToken = config.accessToken || null;
    this.refreshToken = config.refreshToken || null;
    this.tokenExpiresAt = config.tokenExpiresAt || null;
  }

  /**
   * Sets the token for the OAuth2Auth instance.
   * @param token - The token to set.
   * @returns The OAuth2Auth instance. Useful for chaining methods.
   */
  public setToken(token: IOAuth2Token) {
    this.accessToken = token.accessToken;
    this.refreshToken = token.refreshToken;
    this.tokenExpiresAt = token.tokenExpiresAt;
    return this;
  }

  /**
   * Generates the OAuth 2.0 authorize URL for user authentication.
   * @param scopes - Array of scopes (e.g., ['tweet.read', 'tweet.write', 'offline.access'])
   * @param redirectUri - The callback URL registered in your app settings
   * @param state - A random string to prevent CSRF attacks
   * @param codeChallenge - The PKCE code challenge (e.g., base64url-encoded SHA256 of code verifier)
   * @param codeChallengeMethod - 'S256' (recommended) or 'plain'
   * @returns The authorize URL to redirect the user to
   */
  public generateAuthorizeUrl(
    scopes: string[],
    redirectUri: string,
    state: string,
    codeChallenge: string,
    codeChallengeMethod: 'S256' | 'plain' = 'S256'
  ): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    });
    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchanges the authorization code for access and refresh tokens.
   * @param code - The authorization code from the redirect
   * @param redirectUri - The same redirect URI used in the authorize URL
   * @param codeVerifier - The original code verifier used to generate the code challenge
   */
  async exchangeAuthCodeForToken(code: string, redirectUri: string, codeVerifier: string): Promise<this> {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: this.clientId,
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to exchange authorization code: ${error}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token || null; // Only provided if offline.access scope is included
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000; // Convert seconds to milliseconds
    return this;
  }

  /**
   * Provides authentication headers with a valid access token.
   * @returns A promise resolving to the headers
   */
  public async getHeaders(): Promise<{ Authorization: string }> {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    if (this.isTokenExpired() && this.refreshToken) {
      await this.refreshAccessToken();
    }

    if (!this.accessToken) {
      throw new Error('Failed to obtain a valid access token');
    }

    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  public async refreshAccessToken(): Promise<this> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available to refresh access token');
    }

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
        client_id: this.clientId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to refresh token: ${error}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token || this.refreshToken; // Update if a new refresh token is provided
    this.tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return this;
  }

  /**
   * Checks if the access token has expired.
   * @returns True if expired or no expiration set
   */
  public isTokenExpired(): boolean {
    if (!this.tokenExpiresAt) {
      return true;
    }
    return Date.now() >= this.tokenExpiresAt;
  }

}
