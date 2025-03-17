import { IHttpAdapter } from 'src/interfaces/IHttpAdapter';
import type { IOAuth2Auth, IOAuth2Config, IOAuth2Token } from '../interfaces/auth/IOAuth2Auth';
import { NullablePartial, TwitterApiScope } from '../types/x-api/shared';
import crypto from 'crypto';

/**
 * Implementation of OAuth 2.0 authentication for Twitter API v2.
 */
export class OAuth2Auth implements IOAuth2Auth {
  private clientId: string;
  private clientSecret?: string;
  private redirectUri?: string;
  private state: string;
  private codeVerifier: string;
  private scopes: TwitterApiScope[];
  private accessToken: string | null;
  private refreshToken: string | null;
  private tokenExpiresAt: number | null;

  constructor(config: IOAuth2Config, private httpAdapter: IHttpAdapter) {
    if (!config.clientId) {
      throw new Error('OAuth2Auth requires a client ID');
    } else if (!this.httpAdapter) {
      throw new Error('OAuth2Auth requires a httpAdapter');
    }
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.redirectUri = config.redirectUri;
    this.state = config.state || this.generateState();
    this.codeVerifier = config.codeVerifier || this.generateCodeVerifier();
    this.scopes = config.scopes;
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
   * Gets the token for the OAuth2Auth instance.
   * @returns The token.
   */
  public getToken(): NullablePartial<IOAuth2Token> {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      tokenExpiresAt: this.tokenExpiresAt,
    };
  }


  /**
   * Generates the OAuth 2.0 authorize URL for user authentication.
   * @param codeChallenge - Optional; The PKCE code challenge (e.g., base64url-encoded SHA256 of code verifier) - if provided, ensures you provide codeVerifier when instanciating this class
   * @param codeChallengeMethod - Optional; 'S256' (recommended) or 'plain'
   * @returns The authorize URL to redirect the user to
   */
  public generateAuthorizeUrl(
    codeChallenge?: string | null,
    codeChallengeMethod: 'S256' | 'plain' = 'S256'
  ): string {
    if (!codeChallenge) {
      codeChallengeMethod = 'S256';
      codeChallenge = this.generateCodeChallenge();
    }
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      scope: this.scopes.join(' '),
      state: this.state,
      code_challenge: codeChallenge,
      code_challenge_method: codeChallengeMethod,
    });
    if (this.redirectUri) {
      params.set('redirect_uri', this.redirectUri);
    }
    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Exchanges the authorization code for access and refresh tokens.
   * @param code - The authorization code from the redirect
   * @param redirectUri - The same redirect URI used in the authorize URL
   * @param codeVerifier - The original code verifier used to generate the code challenge
   */
  public async exchangeAuthCodeForToken(code: string): Promise<this> {
    const authHeader = 'Basic ' + Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier: this.codeVerifier,
    });

    if (this.redirectUri) {
      params.set('redirect_uri', this.redirectUri);
    }

    const response = await this.httpAdapter.fetch<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': authHeader,
      },
      body: params.toString(),
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

    const response = await this.httpAdapter.fetch<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
    }>('https://api.twitter.com/2/oauth2/token', {
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

  /**
   * Encodes a buffer to base64url format.
   * @param buffer - The buffer to encode.
   * @returns The base64url encoded string.
   */
  private base64urlEncode(buffer: Buffer) {
    return buffer
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  /**
   * Generates a random code verifier.
   * @returns The code verifier.
   */
  private generateCodeVerifier(): string {
    return this.base64urlEncode(crypto.randomBytes(32));
  }

  private generateCodeChallenge(): string {
    return this.base64urlEncode(crypto.createHash('sha256').update(this.codeVerifier).digest())
  }

  private generateState(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}
