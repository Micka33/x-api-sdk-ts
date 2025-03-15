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

/**
 * Interface for a client that makes requests to the Twitter API.
 */
export interface IRequestClient {
  /**
   * Makes a GET request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param params - The query parameters
   * @param headers - The headers to include
   * @returns A promise that resolves to the response data
   */
  get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T>;

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
  post<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>,
    contentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data'
  ): Promise<T>;

  /**
   * Makes a PUT request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  put<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>
  ): Promise<T>;

  /**
   * Makes a DELETE request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  delete<T>(url: string, headers?: Record<string, string>, params?: Record<string, any>): Promise<T>;

  /**
   * Makes a PATCH request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  patch<T>(
    url: string,
    body?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>
  ): Promise<T>;
}
