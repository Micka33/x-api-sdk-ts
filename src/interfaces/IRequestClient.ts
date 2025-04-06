import { ICustomBaseResponse, IRateLimitInfo } from "src/types/x-api/base_response";
import { IHttpAdapter } from "./IHttpAdapter";
import { IXError } from "src/types/x-api/error_responses";
export interface RCResponseSimple<T> {
  /**
   * The parsed response body
   */
  data: T;
  /**
   * Whether the request was successful per HTTP status code
   */
  ok: boolean;
  /**
   * The HTTP status code
   */
  status: number;
  /**
   * The response headers
   */
  headers: Headers;
  /**
   * The rate limit info
   */
  rateLimitInfo: IRateLimitInfo;
}

export interface RCResponse<T, Others = IXError | string | null | undefined> extends RCResponseSimple<T | Others> {}

/**
 * Request options for the Twitter API.
 */
export interface RequestOptions {
  /** The HTTP method to use */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  
  /** The URL to request */
  url: string;
  
  /** The headers to include in the request */
  headers?: Record<string, string>;
  
  /** The query parameters to include in the URL */
  params?: Record<string, any>;
  
  /** The body of the request */
  body?: any;
  
  /** The content type of the request */
  contentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data';
  
  /** Whether to include credentials in the request */
  withCredentials?: boolean;
}

export interface IRequestClientConstructor {
  new (httpAdapter: IHttpAdapter): AbstractRequestClient;
}

/**
 * Interface for a client that makes requests to the Twitter API.
 */
export abstract class AbstractRequestClient {
  constructor(protected httpAdapter: IHttpAdapter) {}

  /**
   * Checks if a response is a success response.
   * 
   * @param response - The response to check
   * @returns Whether the response is a success response
   */
  public static isSuccessResponse<T>(response: RCResponse<T>): response is RCResponseSimple<T> {
    return response.ok && response.headers.get('content-type') !== 'application/problem+json';
  }
  public isSuccessResponse<T>(response: RCResponse<T>): response is RCResponseSimple<T> {
    return AbstractRequestClient.isSuccessResponse(response);
  }

  /**
   * Makes a GET request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param params - The query parameters
   * @param headers - The headers to include
   * @returns A promise that resolves to the response data
   */
  abstract get<T extends ICustomBaseResponse>(
    url: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ): Promise<RCResponse<T>>;

  /**
   * Makes a POST request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @param contentType - The content type of the request body
   * @returns A promise that resolves to the response data
   */
  abstract post<T extends ICustomBaseResponse>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>,
    contentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data'
  ): Promise<RCResponse<T>>;

  /**
   * Makes a PUT request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  abstract put<T extends ICustomBaseResponse>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>
  ): Promise<RCResponse<T>>;

  /**
   * Makes a DELETE request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  abstract delete<T extends ICustomBaseResponse>(
    url: string,
    headers?: Record<string, string>,
    params?: Record<string, any>
  ): Promise<RCResponse<T>>;

  /**
   * Makes a PATCH request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  abstract patch<T extends ICustomBaseResponse>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>
  ): Promise<RCResponse<T>>;
}
