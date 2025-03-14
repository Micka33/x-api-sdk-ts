/**
 * Interface for authentication providers.
 * Implementations should handle generating authentication headers for Twitter API requests.
 */
export interface IAuth {
  /**
   * Generates authentication headers for a Twitter API request.
   * 
   * @param url - The full URL of the request
   * @param method - The HTTP method (GET, POST, etc.)
   * @param params - Optional parameters for the request
   * @returns An object containing the authentication headers
   */
  getHeaders(
    url: string, 
    method: string, 
    params?: Record<string, any>
  ): Promise<Record<string, string>>;
}
