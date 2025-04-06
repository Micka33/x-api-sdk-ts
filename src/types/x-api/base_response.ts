import { IXError } from "./error_responses";

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
}

export interface IBaseResponse<T extends object> extends ICustomBaseResponse {
  /**
   * Data object containing the created post information.
   */
  data: T;
  /**
   * Array of error objects, if any errors occurred.
   */
  errors?: Array<IXError>;
}
