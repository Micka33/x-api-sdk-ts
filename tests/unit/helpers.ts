import { IOAuth2Config, IHttpAdapter } from "../../src";
import { AbstractOAuth2Auth, IOAuth2Token } from "../../src/interfaces/auth/IOAuth2Auth";
import { AbstractRequestClient } from "../../src/interfaces/IRequestClient";

export class FakeOAuth2Auth extends AbstractOAuth2Auth {
  constructor(config: IOAuth2Config, httpAdapter: IHttpAdapter) {
    super(config, httpAdapter);
  }
  setToken(token: IOAuth2Token): this {
    return this;
  }
  getToken(): IOAuth2Token {
    return {} as IOAuth2Token;
  }
  generateAuthorizeUrl(
    state: string,
    codeChallenge?: string | null,
    codeChallengeMethod?: 'S256' | 'plain'
  ): string {
    return '';
  }
  exchangeAuthCodeForToken(code: string, redirectUri: string, codeVerifier: string): Promise<this> {
    return Promise.resolve(this);
  }
  refreshAccessToken(): Promise<this> {
    return Promise.resolve(this);
  }
  getHeaders(): Promise<{ Authorization: string }> {
    return Promise.resolve({ Authorization: 'Bearer mock-token' });
  }
  isTokenExpired(): boolean {
    return false;
  }
  getAuthorizationHeaders(): Promise<{ Authorization: string }> {
    return Promise.resolve({ Authorization: 'Bearer mock-token' });
  }
}

export class FakeRequestClient extends AbstractRequestClient {
  get<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return Promise.resolve({} as T);
  }
  post<T>(url: string, body?: any, headers?: Record<string, string>, params?: Record<string, any>, contentType?: 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data'): Promise<T> {
    return Promise.resolve({} as T);
  }
  put<T>(url: string, body?: any, headers?: Record<string, string>, params?: Record<string, any>): Promise<T> {
    return Promise.resolve({} as T);
  }
  delete<T>(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<T> {
    return Promise.resolve({} as T);
  }
  patch<T>(url: string, body?: any, headers?: Record<string, string>, params?: Record<string, any>): Promise<T> {
    return Promise.resolve({} as T);
  }
}