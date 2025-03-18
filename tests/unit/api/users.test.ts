import { Users } from '../../../src/api/users';
import { IOAuth1Auth } from '../../../src/interfaces/auth/IOAuth1Auth';
import { IOAuth2Auth } from '../../../src/interfaces/auth/IOAuth2Auth';
import { IRequestClient } from '../../../src/interfaces/IRequestClient';
import { IGetMeResponse } from '../../../src/types/x-api/users/get_me_response';
import { ExpansionUser } from '../../../src/types/x-api/users/get_me_query';
import { TweetField, UserField } from '../../../src/types/x-api/shared';

describe('Users', () => {
  let users: Users;
  let mockOAuth1: IOAuth1Auth;
  let mockOAuth2: IOAuth2Auth;
  let mockRequestClient: IRequestClient;
  const baseUrl = 'https://api.twitter.com';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock auth providers
    mockOAuth1 = {
      getAsAuthorizationHeader: jest.fn(),
      getAuthorizationHeaders: jest.fn(),
      setToken: jest.fn().mockReturnThis(),
    };

    mockOAuth2 = {
      generateAuthorizeUrl: jest.fn(),
      exchangeAuthCodeForToken: jest.fn(),
      refreshAccessToken: jest.fn(),
      getToken: jest.fn(),
      setToken: jest.fn(),
      isTokenExpired: jest.fn(),
      getHeaders: jest.fn().mockResolvedValue({
        Authorization: 'Bearer mock-token',
      }),
    };

    // Create mock request client
    mockRequestClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    };

    // Create users instance with mocks
    users = new Users(baseUrl, mockOAuth1, mockOAuth2, mockRequestClient);
  });

  describe('getMe', () => {
    it('should get authenticated user info with default fields', async () => {
      // Mock data
      const defaultFields = ['id', 'username'] as UserField[];
      const mockResponse: IGetMeResponse = {
        data: {
          id: '12345',
          name: 'Test User',
          username: 'testuser'
        }
      };

      // Setup mock implementation
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await users.getMe();

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
        `${baseUrl}/2/users/me`,
        { 'user.fields': defaultFields },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get authenticated user info with custom fields', async () => {
      // Mock data
      const customFields = ['id', 'name', 'username', 'verified'] as UserField[];
      const mockResponse: IGetMeResponse = {
        data: {
          id: '12345',
          name: 'Test User',
          username: 'testuser',
          verified: true
        }
      };

      // Setup mock implementation
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await users.getMe(customFields);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
        `${baseUrl}/2/users/me`,
        { 'user.fields': customFields },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get authenticated user info with expansions and tweet fields', async () => {
      // Mock data
      const userFields = ['id', 'name', 'username', 'verified'] as UserField[];
      const expansions = ['pinned_tweet_id'] as ExpansionUser[];
      const tweetFields = ['id', 'text', 'created_at'] as TweetField[];
      
      const mockResponse = {
        data: {
          id: '12345',
          name: 'Test User',
          username: 'testuser',
          verified: true,
          pinned_tweet_id: '67890'
        },
        includes: {
          tweets: [
            {
              id: '67890',
              text: 'This is my pinned tweet!',
              created_at: '2023-01-01T12:00:00Z'
            }
          ]
        }
      } as unknown as IGetMeResponse;

      // Setup mock implementation
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await users.getMe(userFields, expansions, tweetFields);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
        `${baseUrl}/2/users/me`,
        {
          'user.fields': userFields,
          'expansions': expansions,
          'tweet.fields': tweetFields
        },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when getting user info', async () => {
      // Mock error
      const mockError = new Error('Failed to get user info');

      // Setup mock implementation to throw an error
      (mockRequestClient.get as jest.Mock).mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(users.getMe())
        .rejects.toThrow('Failed to get user info');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
    });

    it('should handle authentication errors', async () => {
      // Mock authentication error
      const mockAuthError = new Error('Authentication failed');

      // Setup mock implementation to throw an error during authentication
      mockOAuth2.getHeaders = jest.fn().mockRejectedValue(mockAuthError);

      // Call the method and expect it to throw
      await expect(users.getMe())
        .rejects.toThrow('Authentication failed');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).not.toHaveBeenCalled();
    });
  });
});
