import { parseTwitterError } from './error';
import { parseRateLimitHeaders } from './rate-limit';
import { RequestOptions, AbstractRequestClient } from '../interfaces/IRequestClient';
import { IHttpFetchResponse } from '../interfaces/IHttpAdapter';
import { ICustomBaseResponse, IRateLimitInfo } from 'src/types/x-api/base_response';

/**
 * Client for making requests to the Twitter API.
 */
export class RequestClient extends AbstractRequestClient {
  /**
   * Makes a GET request to the Twitter API.
   * 
   * @param url - The URL to request
   * @param params - The query parameters
   * @param headers - The headers to include
   * @returns A promise that resolves to the response data
   */
  public async get<T extends ICustomBaseResponse>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
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
  public async post<T extends ICustomBaseResponse>(
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
  public async put<T extends ICustomBaseResponse>(
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
  public async delete<T extends ICustomBaseResponse>(url: string, headers?: Record<string, string>, params?: Record<string, any>): Promise<T> {
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
  public async patch<T extends ICustomBaseResponse>(
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
   * Makes a request to the Twitter API.
   * 
   * @param options - The request options
   * @returns A promise that resolves to the response data
   */
  private async request<T extends ICustomBaseResponse>(options: RequestOptions): Promise<T> {
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
      
      const response = await this.httpAdapter.fetch<T>(url, fetchOptions);

      // Handle the response
      return this.handleResponse<T>(response);
    } catch (error) {
      throw parseTwitterError(error);
    }
  }

  /**
   * Handles a response from the Twitter API.
   * 
   * @param response - The response from the Twitter API
   * @returns The response data
   * @private
   */
  private async handleResponse<T extends ICustomBaseResponse>(response: IHttpFetchResponse<T>): Promise<T> {
    let rateLimitInfo: IRateLimitInfo | undefined;
    // Convert Headers to a plain object
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    rateLimitInfo = parseRateLimitHeaders(headers);

    // Handle empty responses (like for APPEND commands)
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return undefined as unknown as T;
    }

    // Parse the response body
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const jsonObject = await response.json();
      if (rateLimitInfo) {
        jsonObject.rateLimitInfo = rateLimitInfo;
      }
      return {...jsonObject, rateLimitInfo } as unknown as T;
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
        // if (Array.isArray(value)) {
        //   value.forEach((item) => {
        //     url.searchParams.append(key, item.toString());
        //   });
        // } else {
          url.searchParams.append(key, value.toString());
        // }
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
