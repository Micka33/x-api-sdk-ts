import { TwitterClient } from '../../src';
import { IAuth } from '../../src/interfaces/IAuth';
import { RequestOptions } from '../../src/interfaces/ITwitterClient';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios> & jest.Mock;

// Mock auth provider
class MockAuth implements IAuth {
  async getHeaders(
    url: string,
    method: string,
    params?: Record<string, any>
  ): Promise<Record<string, string>> {
    return {
      Authorization: 'Bearer mock-token',
    };
  }
}

describe('TwitterClient', () => {
  let client: TwitterClient;
  let mockAuth: IAuth;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock auth provider
    mockAuth = new MockAuth();

    // Create client with mock auth provider
    client = new TwitterClient(
      { apiKey: 'mock-key', apiSecret: 'mock-secret' },
      {} as any, // tweets
      {} as any, // media
      {} as any, // users
      {} as any, // searches
      {} as any, // streams
      mockAuth
    );
  });

  describe('request', () => {
    it('should make a request with the correct parameters', async () => {
      // Mock axios response
      mockedAxios.mockResolvedValueOnce({
        data: { id: '123', text: 'Hello, world!' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      // Make request
      const options: RequestOptions = {
        url: '/1.1/statuses/update.json',
        method: 'POST',
        data: { status: 'Hello, world!' },
      };

      const result = await client.request(options);

      // Check that axios was called with the correct parameters
      expect(mockedAxios).toHaveBeenCalledWith({
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        method: 'POST',
        headers: {
          Authorization: 'Bearer mock-token',
        },
        data: { status: 'Hello, world!' },
      });

      // Check that the result is correct
      expect(result).toEqual({ id: '123', text: 'Hello, world!' });
    });

    it('should handle errors correctly', async () => {
      // Mock axios error
      mockedAxios.mockRejectedValueOnce({
        response: {
          data: {
            errors: [{ code: 401, message: 'Unauthorized' }],
          },
          status: 401,
          headers: {},
        },
      });

      // Make request
      const options: RequestOptions = {
        url: '/1.1/statuses/update.json',
        method: 'POST',
        data: { status: 'Hello, world!' },
      };

      // Expect the request to throw an error
      await expect(client.request(options)).rejects.toThrow('Unauthorized');
    });
  });

  describe('createClient', () => {
    it('should create a client with OAuth1Auth for v1.1 credentials', () => {
      const client = TwitterClient.createClient({
        apiKey: 'mock-key',
        apiSecret: 'mock-secret',
        accessToken: 'mock-token',
        accessTokenSecret: 'mock-token-secret',
      });

      expect(client).toBeInstanceOf(TwitterClient);
    });

    it('should create a client with OAuth2Auth for v2 credentials', () => {
      const client = TwitterClient.createClient({
        clientId: 'mock-client-id',
        clientSecret: 'mock-client-secret',
        bearerToken: 'mock-bearer-token',
      });

      expect(client).toBeInstanceOf(TwitterClient);
    });
  });
});
