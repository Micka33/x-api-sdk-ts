import { Users } from '../../../src/api/users';
import { IOAuth2Config } from '../../../src/interfaces/auth/IOAuth2Auth';
import { IGetMeResponse } from '../../../src/types/x-api/users/get_me_response';
import { ExpansionUser } from '../../../src/types/x-api/users/get_me_query';
import { TweetField, UserField } from '../../../src/types/x-api/shared';
import { FetchAdapter, RCResponseSimple } from '../../../src';
import { FakeRequestClient, FakeOAuth2Auth } from '../helpers';

describe('Users', () => {
  const baseUrl = 'https://api.x.com';
  const oAuth2Config: IOAuth2Config = {
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
    scopes: [],
    redirectUri: 'http://localhost:3000/oauth2/callback'
  };
  const httpAdapter = new FetchAdapter();
  const requestClient = new FakeRequestClient(httpAdapter);
  const oAuth2 = new FakeOAuth2Auth(oAuth2Config, httpAdapter);
  const users = new Users(baseUrl, null, oAuth2, requestClient);
  const getMock = jest.spyOn(requestClient, 'get');
  const getHeadersMock = jest.spyOn(oAuth2, 'getHeaders');

  beforeEach(() => {
    getMock.mockClear();
    getHeadersMock.mockClear();
  });

  describe('getMe', () => {
    it('should get authenticated user info with default fields', async () => {
      // Mock data
      const defaultFields = ['id', 'username'] as UserField[];
      const mockResponse: Omit<RCResponseSimple<IGetMeResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            id: '12345',
            name: 'Test User',
            username: 'testuser'
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await users.getMe();

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith(
          `${baseUrl}/2/users/me`,
          { 'user.fields': defaultFields },
          {
            Authorization: 'Bearer mock-token',
            'Content-Type': 'application/json'
          }
        );
        expect(result.data).toEqual(mockResponse.data);
      } else {
        fail('Expected success response but got error');
      }
    });

    it('should get authenticated user info with custom fields', async () => {
      // Mock data
      const customFields = ['id', 'name', 'username', 'verified'] as UserField[];
      const mockResponse: Omit<RCResponseSimple<IGetMeResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            id: '12345',
            name: 'Test User',
            username: 'testuser',
            verified: true
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await users.getMe(customFields);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith(
          `${baseUrl}/2/users/me`,
          { 'user.fields': customFields },
          {
            Authorization: 'Bearer mock-token',
            'Content-Type': 'application/json'
          }
        );
        expect(result.data).toEqual(mockResponse.data);
      } else {
        fail('Expected success response but got error');
      }
    });

    it('should get authenticated user info with expansions and tweet fields', async () => {
      // Mock data
      const userFields = ['id', 'name', 'username', 'verified'] as UserField[];
      const expansions = ['pinned_tweet_id'] as ExpansionUser[];
      const tweetFields = ['id', 'text', 'created_at'] as TweetField[];
      
      const mockResponse: Omit<RCResponseSimple<IGetMeResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            id: '12345',
            name: 'Test User',
            username: 'testuser',
            verified: true,
            pinned_tweet_id: '67890'
          },
          // includes: {
          //   tweets: [
          //     {
          //       id: '67890',
          //       text: 'This is my pinned tweet!',
          //       created_at: '2023-01-01T12:00:00Z'
          //     }
          //   ]
          // }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await users.getMe(userFields, expansions, tweetFields);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith(
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
        expect(result.data).toEqual(mockResponse.data);
      } else {
        fail('Expected success response but got error');
      }
    });

    it('should handle errors when getting user info', async () => {
      // Mock error
      const mockError = new Error('Failed to get user info');

      // Setup mock implementation to throw an error
      getMock.mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(users.getMe())
        .rejects.toThrow('Failed to get user info');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledTimes(1);
    });

    it('should handle authentication errors', async () => {
      // Mock authentication error
      const mockAuthError = new Error('Authentication failed');

      // Setup mock implementation to throw an error during authentication
      getHeadersMock.mockRejectedValue(mockAuthError);

      // Call the method and expect it to throw
      await expect(users.getMe())
        .rejects.toThrow('Authentication failed');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(getMock).not.toHaveBeenCalled();
    });
  });
});
