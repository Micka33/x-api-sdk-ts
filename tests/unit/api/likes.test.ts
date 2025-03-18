import { Likes } from '../../../src/api/likes';
import { IOAuth1Auth } from '../../../src/interfaces/auth/IOAuth1Auth';
import { IOAuth2Auth } from '../../../src/interfaces/auth/IOAuth2Auth';
import { IRequestClient } from '../../../src/interfaces/IRequestClient';
import { ILikePostResponse } from '../../../src/types/x-api/likes/like_post_response';

describe('Likes', () => {
  let likes: Likes;
  let mockOAuth1: IOAuth1Auth;
  let mockOAuth2: IOAuth2Auth;
  let mockRequestClient: IRequestClient;
  const baseUrl = 'https://api.twitter.com';

  beforeEach(() => {
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

    // Create likes instance with mocks
    likes = new Likes(baseUrl, mockOAuth1, mockOAuth2, mockRequestClient);
  });

  describe('likePost', () => {
    it('should like a post successfully', async () => {
      // Mock data
      const userId = '12345';
      const postId = '67890';
      const mockResponse: ILikePostResponse = {
        data: {
          liked: true
        }
      };

      // Setup mock implementation
      mockRequestClient.post = jest.fn().mockResolvedValue(mockResponse);

      // Call the method
      const result = await likes.likePost(userId, postId);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledWith(
        `${baseUrl}/2/users/${userId}/likes`,
        { tweet_id: postId },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.liked).toBe(true);
    });

    it('should handle API errors when liking a post', async () => {
      // Mock data
      const userId = '12345';
      const postId = '67890';
      const mockError = new Error('API Error');

      // Setup mock implementation to throw an error
      mockRequestClient.post = jest.fn().mockRejectedValue(mockError);

      // Call the method and expect it to throw
      await expect(likes.likePost(userId, postId)).rejects.toThrow('API Error');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
    });

    it('should handle authentication errors', async () => {
      // Mock data
      const userId = '12345';
      const postId = '67890';
      const mockAuthError = new Error('Authentication failed');

      // Setup mock implementation to throw an error during authentication
      mockOAuth2.getHeaders = jest.fn().mockRejectedValue(mockAuthError);

      // Call the method and expect it to throw
      await expect(likes.likePost(userId, postId)).rejects.toThrow('Authentication failed');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).not.toHaveBeenCalled();
    });
  });
});
