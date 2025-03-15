import { parseTwitterError } from './error';
import { parseRateLimitHeaders, isRateLimitExceeded, RateLimitInfo } from './rate-limit';
import { RateLimitError } from './error';

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
 * Client for making requests to the Twitter API.
 */
export class RequestClient {
  /**
   * Makes a request to the Twitter API.
   * 
   * @param options - The request options
   * @returns A promise that resolves to the response data
   */
  public async request<T>(options: RequestOptions): Promise<T> {
    try {
      // Build the URL with query parameters
      const url = this.buildUrl(options.url, options.params);
      
      // Prepare the request options
      const fetchOptions: RequestInit = {
        method: options.method,
        headers: options.headers || {},
        credentials: options.withCredentials ? 'include' : 'same-origin'
      };
      
      // Add the body if provided
      if (options.body) {
        if (options.contentType === 'application/json') {
          fetchOptions.body = JSON.stringify(options.body);
          (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
        } else if (options.contentType === 'application/x-www-form-urlencoded') {
          fetchOptions.body = this.buildFormData(options.body).toString();
          (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/x-www-form-urlencoded';
        } else if (options.contentType === 'multipart/form-data') {
          // For multipart/form-data, we don't set the Content-Type header
          // as the browser will set it with the correct boundary
          fetchOptions.body = this.buildFormData(options.body, true);
        } else {
          fetchOptions.body = options.body;
        }
      }
      
      // Make the request
      const response = await fetch(url, fetchOptions);
      
      // Handle the response
      return this.handleResponse<T>(response);
    } catch (error) {
      throw parseTwitterError(error);
    }
  }
  
  /**
   * Makes a GET request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param params - The query parameters
   * @param headers - The headers to include
   * @returns A promise that resolves to the response data
   */
  public async get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return this.request<T>({
      method: 'GET',
      url,
      params,
      headers
    });
  }
  
  /**
   * Makes a POST request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  public async post<T>(
    url: string, 
    body?: any, 
    headers?: Record<string, string>, 
    params?: Record<string, any>,
    contentType: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' = 'application/json'
  ): Promise<T> {
    return this.request<T>({
      method: 'POST',
      url,
      body,
      headers,
      params,
      contentType
    });
  }
  
  /**
   * Makes a PUT request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  public async put<T>(
    url: string, 
    body?: any, 
    headers?: Record<string, string>, 
    params?: Record<string, any>
  ): Promise<T> {
    return this.request<T>({
      method: 'PUT',
      url,
      body,
      headers,
      params,
      contentType: 'application/json'
    });
  }
  
  /**
   * Makes a DELETE request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  public async delete<T>(url: string, headers?: Record<string, string>, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      method: 'DELETE',
      url,
      headers,
      params
    });
  }
  
  /**
   * Makes a PATCH request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param body - The body of the request
   * @param headers - The headers to include
   * @param params - The query parameters
   * @returns A promise that resolves to the response data
   */
  public async patch<T>(
    url: string, 
    body?: any, 
    headers?: Record<string, string>, 
    params?: Record<string, any>
  ): Promise<T> {
    return this.request<T>({
      method: 'PATCH',
      url,
      body,
      headers,
      params,
      contentType: 'application/json'
    });
  }
  
  /**
   * Handles a response from the Twitter API.
   * 
   * @param response - The response from the Twitter API
   * @returns The response data
   * @private
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    // Convert Headers to a plain object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    
    const rateLimitInfo = parseRateLimitHeaders(headers);
    
    // Check if the rate limit has been exceeded
    if (rateLimitInfo && isRateLimitExceeded(rateLimitInfo)) {
      throw new RateLimitError('Twitter API rate limit exceeded', rateLimitInfo.reset);
    }
    
    // Check if the response is successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw parseTwitterError({
        response: {
          status: response.status,
          data: errorData,
          headers
        }
      });
    }
    
    // Handle empty responses (like for APPEND commands)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as unknown as T;
    }
    
    // Parse the response body
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return response.text() as unknown as T;
    }
  }
  
  /**
   * Builds a URL with query parameters.
   * 
   * @param baseUrl - The base URL
   * @param params - The query parameters
   * @returns The URL with query parameters
   * @private
   */
  private buildUrl(baseUrl: string, params?: Record<string, any>): string {
    if (!params) {
      return baseUrl;
    }
    
    const url = new URL(baseUrl);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            url.searchParams.append(key, item.toString());
          });
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    });
    
    return url.toString();
  }
  
  /**
   * Builds a form data object from parameters.
   * 
   * @param params - The parameters
   * @param useFormData - Whether to use FormData instead of URLSearchParams
   * @returns A URLSearchParams or FormData object
   * @private
   */
  private buildFormData(params: Record<string, any>, useFormData = false): URLSearchParams | FormData {
    if (useFormData) {
      const formData = new FormData();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              formData.append(key, item);
            });
          } else if (value instanceof Blob) {
            // Special handling for Blob objects (like media uploads)
            formData.append(key, value);
          } else if (typeof value === 'object' && value.constructor === Object) {
            // Regular object, stringify it
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      return formData;
    } else {
      const urlSearchParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              urlSearchParams.append(key, item.toString());
            });
          } else if (value instanceof Blob) {
            // Blobs can't be added to URLSearchParams, so we'll just skip them
            console.warn(`Skipping Blob value for key '${key}' in URLSearchParams`);
          } else if (typeof value === 'object') {
            urlSearchParams.append(key, JSON.stringify(value));
          } else {
            urlSearchParams.append(key, value.toString());
          }
        }
      });
      
      return urlSearchParams;
    }
  }
}
