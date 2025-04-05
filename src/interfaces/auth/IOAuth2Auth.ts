import { NullablePartial, TwitterApiScope } from '../../types/x-api/shared';
import { AbstractOAuthConstructor } from './IOAuthConstructor';
/**
 * Interface for OAuth 2.0 tokens.
 */
export interface IOAuth2Token {
  /** The token used in the Authorization header for API requests. */
  accessToken: string;
  /** Allows refreshing the access token without user re-authentication (requires the `offline.access` scope). */
  refreshToken: string;
  /** Tracks when the access token expires. */
  tokenExpiresAt: number;
}

/**
 * Configuration for OAuth 2.0 authentication.
 */
export interface IOAuth2Config extends Partial<IOAuth2Token> {
  /** Required for all clients, found in your app’s “Keys and Tokens” section in the Twitter Developer Portal. */
  clientId: string;
  /** Required; scopes to request from the user. */
  scopes: TwitterApiScope[];
  /** Optional; only needed for confidential clients (e.g., web apps) if using client credentials flow later. For PKCE, it’s not required in the token exchange. */
  redirectUri?: string;
  /** Optional; a random string to prevent CSRF attacks. */
  state?: string;
  /** Optional; only needed for confidential clients (e.g., web apps) if using client credentials flow later. For PKCE, it’s not required in the token exchange. */
  clientSecret?: string;
  /** Optional; only needed for confidential clients (e.g., web apps) if using client credentials flow later. For PKCE, it’s not required in the token exchange. */
  codeVerifier?: string;
}

/**
 * Interface for OAuth 2.0 authentication.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export abstract class AbstractOAuth2Auth extends AbstractOAuthConstructor<IOAuth2Config> {
  /**
     * Sets the token for the OAuth2Auth instance.
     * @param token - The token to set.
     * @returns The OAuth2Auth instance. Useful for chaining methods.
     */
  abstract setToken(token: IOAuth2Token): this;

  /**
   * Gets the token for the OAuth2Auth instance.
   * @returns The token.
   */
  abstract getToken(): NullablePartial<IOAuth2Token>;

  /**
   * Generates the OAuth 2.0 authorize URL for user authentication.
   * @param scopes - Array of scopes (e.g., ['tweet.read', 'tweet.write', 'offline.access'])
   * @param redirectUri - The callback URL registered in your app settings
   * @param state - A random string to prevent CSRF attacks
   * @param codeChallenge - The PKCE code challenge (e.g., base64url-encoded SHA256 of code verifier)
   * @param codeChallengeMethod - 'S256' (recommended) or 'plain'
   * @returns The authorize URL to redirect the user to
   */
  abstract generateAuthorizeUrl(
    state: string,
    codeChallenge?: string | null,
    codeChallengeMethod?: 'S256' | 'plain'
  ): string;

  /**
   * Exchanges the authorization code for access and refresh tokens.
   * @param code - The authorization code from the redirect
   * @param redirectUri - The same redirect URI used in the authorize URL
   * @param codeVerifier - The original code verifier used to generate the code challenge
   */
  abstract exchangeAuthCodeForToken(code: string, redirectUri: string, codeVerifier: string): Promise<this>;

  /**
   * Refreshes the access token using the refresh token.
   */
  abstract refreshAccessToken(): Promise<this>;

  /**
   * Provides authentication headers with a valid access token.
   * @returns A promise resolving to the headers
   */
  abstract getHeaders(): Promise<{ Authorization: string }>;

  /**
   * Checks if the access token has expired.
   * @returns True if expired or no expiration set
   */
  abstract isTokenExpired(): boolean;
}
