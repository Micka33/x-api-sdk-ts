import { FetchAdapter } from '../../../src';
import { Likes } from '../../../src/api/likes';
import { IOAuth2Config } from '../../../src/interfaces/auth/IOAuth2Auth';
import { ILikePostResponse } from '../../../src/types/x-api/likes/like_post_response';
import { FakeRequestClient, FakeOAuth2Auth } from '../helpers';


describe('Likes', () => {
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
  const likes = new Likes(baseUrl, null, oAuth2, requestClient);
  const postMock = jest.spyOn(requestClient, 'post');
  const getHeadersMock = jest.spyOn(oAuth2, 'getHeaders');

  beforeEach(() => {
    postMock.mockClear();
    getHeadersMock.mockClear();
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
      postMock.mockImplementation(() => Promise.resolve(mockResponse));

      // Call the method
      const result = await likes.add(userId, postId);

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith(
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
      postMock.mockRejectedValue(mockError);

      // Call the method and expect it to throw
      await expect(likes.add(userId, postId)).rejects.toThrow('API Error');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
    });

    it('should handle authentication errors', async () => {
      // Mock data
      const userId = '12345';
      const postId = '67890';
      const mockAuthError = new Error('Authentication failed');

      // Setup mock implementation to throw an error during authentication
      getHeadersMock.mockRejectedValue(mockAuthError);

      // Call the method and expect it to throw
      await expect(likes.add(userId, postId)).rejects.toThrow('Authentication failed');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).not.toHaveBeenCalled();
    });
  });
});
