/**
 * Response type for the DELETE /2/tweets/{id} endpoint.
 * Represents the response when deleting a post.
 */
export interface DeletePostResponse {
  /**
   * Data object containing the deletion status.
   */
  data: {
    /**
     * Indicates whether the post was successfully deleted.
     * @example true
     */
    deleted: boolean;
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