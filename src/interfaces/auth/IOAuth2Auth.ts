/**
 * Configuration for OAuth 2.0 authentication.
 */
export interface IOAuth2Config {
  /** The client ID */
  clientId?: string;
  /** The client secret */
  clientSecret?: string;
  /** The bearer token */
  bearerToken?: string;
}

/**
 * Interface for OAuth 2.0 authentication.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOAuth2Auth {}
