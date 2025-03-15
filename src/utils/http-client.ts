import { RequestClient } from './request';

/**
 * Singleton instance of the RequestClient.
 */
export const httpClient = new RequestClient();

/**
 * Makes a GET request to the Twitter API.
 * 
 * @param url - The URL to request
 * @param params - The query parameters
 * @param headers - The headers to include
 * @returns A promise that resolves to the response data
 */
export function get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
  return httpClient.get<T>(url, params, headers);
}

/**
 * Makes a POST request to the Twitter API.
 * 
 * @param url - The URL to request
 * @param body - The body of the request
 * @param headers - The headers to include
 * @param params - The query parameters
 * @param contentType - The content type of the request
 * @returns A promise that resolves to the response data
 */
export function post<T>(
  url: string, 
  body?: any, 
  headers?: Record<string, string>, 
  params?: Record<string, any>,
  contentType: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' = 'application/json'
): Promise<T> {
  return httpClient.post<T>(url, body, headers, params, contentType);
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
export function put<T>(
  url: string, 
  body?: any, 
  headers?: Record<string, string>, 
  params?: Record<string, any>
): Promise<T> {
  return httpClient.put<T>(url, body, headers, params);
}

/**
 * Makes a DELETE request to the Twitter API.
 * 
 * @param url - The URL to request
 * @param headers - The headers to include
 * @param params - The query parameters
 * @returns A promise that resolves to the response data
 */
export function del<T>(url: string, headers?: Record<string, string>, params?: Record<string, any>): Promise<T> {
  return httpClient.delete<T>(url, headers, params);
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
export function patch<T>(
  url: string, 
  body?: any, 
  headers?: Record<string, string>, 
  params?: Record<string, any>
): Promise<T> {
  return httpClient.patch<T>(url, body, headers, params);
} 