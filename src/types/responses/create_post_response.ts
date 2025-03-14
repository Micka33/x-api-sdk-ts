/**
 * Response type for the POST /2/tweets endpoint.
 * Represents the response when creating a new post.
 */
export interface CreatePostResponse {
  /**
   * Data object containing the created post information.
   */
  data: {
    /**
     * The unique identifier of the created post.
     * @example "1346889436626259968"
     */
    id: string;
    
    /**
     * The content of the created post.
     * @example "Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2 to explore Tweet\\u2026 https:\\/\\/t.co\\/56a0vZUx7i"
     */
    text: string;
  };
  
  /**
   * Array of error objects, if any errors occurred.
   * Formatted per the HTTP Problem Details standard (IETF RFC 7807).
   */
  errors?: Array<{
    /**
     * The title of the error.
     */
    title: string;
    
    /**
     * The type of error.
     */
    type: string;
    
    /**
     * Detailed description of the error.
     */
    detail?: string;
    
    /**
     * HTTP status code associated with the error.
     */
    status?: number;
  }>;
}
