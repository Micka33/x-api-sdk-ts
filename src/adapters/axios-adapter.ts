import { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosStatic, CreateAxiosDefaults } from 'axios';
import { IHttpAdapter, IHttpFetchResponse } from 'src/interfaces/IHttpAdapter';

export class AxiosAdapter implements IHttpAdapter {
  private axiosInstance: AxiosInstance;

  constructor(private axios: AxiosStatic, config?: CreateAxiosDefaults) {
    this.axiosInstance = axios.create(config);
  }

  public async fetch<T>(url: string, options?: RequestInit): Promise<IHttpFetchResponse<T>> {
    // Convert RequestInit to AxiosRequestConfig
    const axiosConfig: AxiosRequestConfig = {
      method: options?.method || 'GET',
      headers: options?.headers as Record<string, string>,
      data: options?.body,
      signal: options?.signal || undefined,
    };

    try {
      const response: AxiosResponse<T> = await this.axiosInstance(url, axiosConfig);
      // Return an object that matches IHttpFetchResponse
      return this.parseResponse(response);
    } catch (error) {
      if (this.axios.isAxiosError(error) && error.response) {
        return this.parseResponse(error.response);
      }
      throw error;
    }
  }

  private parseResponse<T>(response: AxiosResponse<T>): IHttpFetchResponse<T> {
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      headers: this.parseHeaders(response.headers),
      json: () => Promise.resolve(response?.data as T),
      text: () => Promise.resolve(
        typeof response?.data === 'string'
          ? response.data
          : JSON.stringify(response?.data)
      ),
    }
  }

  private parseHeaders(headers: AxiosResponse['headers']): Headers {
    const stdHeaders = new Headers();
    Object.entries(headers).forEach(([key, value]) => {
      if (value !== undefined) {
        stdHeaders.append(key, value);
      }
    });
    return stdHeaders;
  }
}
