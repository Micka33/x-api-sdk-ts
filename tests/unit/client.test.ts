import { IOAuth1Auth, IOAuth1AuthorizationHeaders, IOAuth1Config, IOAuth1Token, IOAuth2Auth, IOAuth2Config, TwitterClient } from 'src/index';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios> & jest.Mock;

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

describe('TwitterClient', () => {
  let client: TwitterClient;
  let mockAuth: { oAuth1: IOAuth1Auth; oAuth2: IOAuth2Auth };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock auth provider
    const oAuth1Config: IOAuth1Config = { apiKey: 'mock-key', apiSecret: 'mock-secret' };
    const oAuth2Config: IOAuth2Config = { clientId: 'mock-client-id', clientSecret: 'mock-client-secret' };
    mockAuth = { oAuth1: new MockAuth(), oAuth2: {} as IOAuth2Auth };

    // Create client with mock auth provider
    client = new TwitterClient(
      { oAuth1: oAuth1Config, oAuth2: oAuth2Config },
      {
        posts: {} as any,
        media: {} as any,
        users: {} as any,
        searches: {} as any,
        streams: {} as any,
      },
      mockAuth,
    );
  });


  describe('createClient', () => {
    it('should create a client with OAuth1Auth for v1.1 credentials', () => {
      expect(client).toBeInstanceOf(TwitterClient);
    });

    // it('should create a client with OAuth2Auth for v2 credentials', () => {
    //   const client = new TwitterClient({
    //     oAuth1: {} as IOAuth1Config,
    //     oAuth2: { bearerToken: 'mock-bearer-token' },
    //   });

    //   expect(client).toBeInstanceOf(TwitterClient);
    // });
  });
});
