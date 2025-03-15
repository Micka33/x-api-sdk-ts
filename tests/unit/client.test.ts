import {
  IOAuth1Auth,
  IOAuth1AuthorizationHeaders,
  IOAuth1Config,
  IOAuth1Token,
  IOAuth2Auth,
  IOAuth2Config,
  IRequestClient,
  ITwitterClientConfig,
  TwitterClient
} from 'src/index';

// Mock auth provider
class MockAuth implements IOAuth1Auth {
  setToken(_token: IOAuth1Token): this {
    return this;
  }
  getAsAuthorizationHeader(
    _url: string,
    _method: string,
    _params?: Record<string, any>,
    _token?: IOAuth1Token,
  ): { Authorization: string } {
    return {
      Authorization: 'Bearer mock-token',
    };
  }
  getAuthorizationHeaders(
    _url: string,
    _method: string,
    _params?: Record<string, any>,
    _token?: IOAuth1Token,
  ): IOAuth1AuthorizationHeaders {
    return {
      oauth_consumer_key: 'mock-consumer-key',
      oauth_nonce: 'mock-nonce',
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Date.now().toString(),
      oauth_version: '1.0a',
      oauth_signature: 'mock-signature',
    };
  }
}

// Mock RequestClient
class MockRequestClient implements IRequestClient {
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

describe('TwitterClient', () => {
  let client: TwitterClient;
  let mockAuth: { oAuth1: IOAuth1Auth; oAuth2: IOAuth2Auth };
  let mockRequestClient: IRequestClient;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock auth provider
    const oAuth1Config: IOAuth1Config = { apiKey: 'mock-key', apiSecret: 'mock-secret' };
    const oAuth2Config: IOAuth2Config = { clientId: 'mock-client-id', clientSecret: 'mock-client-secret' };
    mockAuth = { oAuth1: new MockAuth(), oAuth2: {} as IOAuth2Auth };
    mockRequestClient = new MockRequestClient();

    // Create client with mock auth provider
    client = new TwitterClient(
      { oAuth1: oAuth1Config, oAuth2: oAuth2Config },
      {
        posts: {} as any,
        media: {} as any,
        users: {} as any,
        likes: {} as any,
      },
      mockRequestClient,
      mockAuth,
    );
  });

  describe('createClient', () => {
    it('should create a TwitterClient', () => {
      const oAuth1Config: IOAuth1Config = { apiKey: 'mock-key', apiSecret: 'mock-secret' };
      const oAuth2Config: IOAuth2Config = { clientId: 'mock-client-id', clientSecret: 'mock-client-secret' };
      const config: ITwitterClientConfig = { oAuth1: oAuth1Config, oAuth2: oAuth2Config };

      const client = new TwitterClient(config);
      expect(client).toBeInstanceOf(TwitterClient);
    });
  });
});
