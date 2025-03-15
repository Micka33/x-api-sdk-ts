/**
 * Response type for the POST /2/tweets endpoint.
 * Represents the response when creating a new post.
 */
export interface IBaseResponse<T extends object> {
  /**
   * Data object containing the created post information.
   */
  data: T;
  
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
