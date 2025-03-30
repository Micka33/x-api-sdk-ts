/**
 * Information about the rate limit for the request.
 */
export interface IRateLimitInfo {
  user: {
    daily: {
      /** 
       * The limit for the endpoint
       */
      limit: number;
      
      /**
       * The remaining requests for the endpoint
       */
      remaining: number;
      
      /**
       * The time when the rate limit resets
       */
      reset: Date;
    }
  },
  /** 
   * The limit for the endpoint
   */
  limit: number;
  
  /**
   * The remaining requests for the endpoint
   */
  remaining: number;
  
  /**
   * The time when the rate limit resets
   */
  reset: Date;
}

export interface ICustomBaseResponse {
  /**
   * Information about the rate limit for the request.
   */
  rateLimitInfo?: IRateLimitInfo;
}

export interface IErrorResponse extends ICustomBaseResponse {
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
   * Additional error details.
   */
  errors?: ({
    parameters?: Record<string, string|string[]>;
    message?: string;
  } | {
    value: string;
    title: string;
    type: string;
    detail?: string;
    resource_type?: string;
    parameter?: string;
    resource_id?: string;
  })[];
}

export interface ISuccessResponse<T extends object> extends ICustomBaseResponse {
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

export type IBaseResponse<T extends object> = ISuccessResponse<T>;
