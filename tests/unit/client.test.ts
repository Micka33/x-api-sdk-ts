import {
  IOAuth2Config,
  TwitterClient
} from '../../src/index';
import { FakeOAuth2Auth, FakeRequestClient } from './helpers';

describe('TwitterClient', () => {
  let client: TwitterClient;

  beforeAll(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock auth provider
    // const oAuth1Config: IOAuth1Config = { apiKey: 'mock-key', apiSecret: 'mock-secret' };
    const oAuth2Config: IOAuth2Config = {
      clientId: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      scopes: [],
      redirectUri: 'http://localhost:3000/oauth2/callback'
    };

    // Create client with mock auth provider
    client = new TwitterClient(
      { 
        // oAuth1: oAuth1Config,
        oAuth2: oAuth2Config
      },
      {
        requestClient: FakeRequestClient,
        auth: { oAuth2: FakeOAuth2Auth },
      }
    );
  });

  describe('createClient', () => {
    it('should create a TwitterClient', () => {
      expect(client).toBeInstanceOf(TwitterClient);
    });
  });
});
