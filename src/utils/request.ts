import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { parseTwitterError } from './error';
import { parseRateLimitHeaders, isRateLimitExceeded, RateLimitInfo } from './rate-limit';
import { RateLimitError } from './error';

/**
 * Makes a request to the Twitter API.
 * 
 * @param options - The request options
 * @returns A promise that resolves to the response data
 */
export async function makeRequest<T>(options: AxiosRequestConfig): Promise<T> {
  try {
    const response = await axios(options);
    return handleResponse<T>(response);
  } catch (error) {
    throw parseTwitterError(error);
  }
}

/**
 * Handles a response from the Twitter API.
 * 
 * @param response - The response from the Twitter API
 * @returns The response data
 */
function handleResponse<T>(response: AxiosResponse): T {
  const rateLimitInfo = parseRateLimitHeaders(response.headers as Record<string, string>);
  
  // Check if the rate limit has been exceeded
  if (rateLimitInfo && isRateLimitExceeded(rateLimitInfo)) {
    throw new RateLimitError('Twitter API rate limit exceeded', rateLimitInfo.reset);
  }
  
  return response.data;
}

/**
 * Builds a URL with query parameters.
 * 
 * @param baseUrl - The base URL
 * @param params - The query parameters
 * @returns The URL with query parameters
 */
export function buildUrl(baseUrl: string, params?: Record<string, any>): string {
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
 * @returns A URLSearchParams object
 */
export function buildFormData(params: Record<string, any>): URLSearchParams {
  const formData = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item.toString());
        });
      } else {
        formData.append(key, value.toString());
      }
    }
  });
  
  return formData;
}
