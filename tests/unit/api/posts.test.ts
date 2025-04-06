import { Posts } from '../../../src/api/posts';
import { IOAuth2Config } from '../../../src/interfaces/auth/IOAuth2Auth';
import { ICreatePostResponse } from '../../../src/types/x-api/posts/create_post_response';
import { IDeletePostResponse } from '../../../src/types/x-api/posts/delete_post_response';
import { IGetPostResponse, IGetPostsResponse } from '../../../src/types/x-api/posts/get_posts_response';
import { ExpansionPost, MediaField } from '../../../src/types/x-api/posts/get_posts_query';
import { TweetField, UserField } from '../../../src/types/x-api/shared';
import { FetchAdapter, RCResponseSimple } from '../../../src';
import { FakeRequestClient, FakeOAuth2Auth } from '../helpers';

describe('Posts', () => {
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
  const posts = new Posts(baseUrl, null, oAuth2, requestClient);
  const getMock = jest.spyOn(requestClient, 'get');
  const postMock = jest.spyOn(requestClient, 'post');
  const deleteMock = jest.spyOn(requestClient, 'delete');
  const getHeadersMock = jest.spyOn(oAuth2, 'getHeaders');

  beforeEach(() => {
    getMock.mockClear();
    postMock.mockClear();
    deleteMock.mockClear();
    getHeadersMock.mockClear();
  });

  describe('createPost', () => {
    it('should create a post with text only', async () => {
      // Mock data
      const text = 'Hello, Twitter!';
      const mockResponse: Omit<RCResponseSimple<ICreatePostResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            id: '1234567890',
            text: text
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      postMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.create(text);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledWith(
          `${baseUrl}/2/tweets`,
          { text },
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

    it('should create a post with additional options', async () => {
      // Mock data
      const text = 'Hello, Twitter!';
      const options = {
        reply: { in_reply_to_tweet_id: '9876543210' },
        poll: {
          options: ['Yes', 'No', 'Maybe'],
          duration_minutes: 60
        },
        quote_tweet_id: '5555555555',
        for_super_followers_only: false
      };
      const mockResponse: Omit<RCResponseSimple<ICreatePostResponse>,  'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            id: '1234567890',
            text: text
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      postMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.create(text, options);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledTimes(1);
        expect(postMock).toHaveBeenCalledWith(
          `${baseUrl}/2/tweets`,
          {
            text,
            reply: options.reply,
            poll: options.poll,
            quote_tweet_id: options.quote_tweet_id,
            for_super_followers_only: options.for_super_followers_only
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

    it('should handle errors when creating a post', async () => {
      // Mock data
      const text = 'Hello, Twitter!';
      const mockError = new Error('Failed to create post');

      // Setup mock implementation to throw an error
      postMock.mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.create(text))
        .rejects.toThrow('Failed to create post');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Mock data
      const postId = '1234567890';
      const mockResponse: Omit<RCResponseSimple<IDeletePostResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            deleted: true
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      deleteMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.delete(postId);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(deleteMock).toHaveBeenCalledTimes(1);
        expect(deleteMock).toHaveBeenCalledWith(
          `${baseUrl}/2/tweets/${postId}`,
          {
            Authorization: 'Bearer mock-token',
            'Content-Type': 'application/json'
          }
        );
        expect(result.data).toEqual(mockResponse.data);
        expect(result.data.data.deleted).toBe(true);
      } else {
        fail('Expected success response but got error');
      }
    });

    it('should handle errors when deleting a post', async () => {
      // Mock data
      const postId = '1234567890';
      const mockError = new Error('Failed to delete post');

      // Setup mock implementation to throw an error
      deleteMock.mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.delete(postId))
        .rejects.toThrow('Failed to delete post');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(deleteMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPost', () => {
    it('should get a post by ID', async () => {
      // Mock data
      const postId = '1234567890';
      const mockResponse: Omit<RCResponseSimple<IGetPostResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            id: postId,
            text: 'Hello, Twitter!'
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.get(postId);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith(
          `${baseUrl}/2/tweets/${postId}`,
          {},
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

    it('should get a post with additional fields and expansions', async () => {
      // Mock data
      const postId = '1234567890';
      const options = {
        tweetFields: ['author_id', 'created_at', 'public_metrics'] as TweetField[],
        expansions: ['author_id'] as ExpansionPost[],
        userFields: ['name', 'username', 'verified'] as UserField[]
      };
      const mockResponse: Omit<RCResponseSimple<IGetPostResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: {
            id: postId,
            text: 'Hello, Twitter!',
            author_id: '9876543210',
            created_at: '2023-01-01T12:00:00Z',
            public_metrics: {
              retweet_count: 5,
              reply_count: 2,
              like_count: 10,
              quote_count: 1
            }
          },
          includes: {
            users: [
              {
                id: '9876543210',
                name: 'Test User',
                username: 'testuser',
                verified: true
              }
            ]
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.get(postId, options);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith(
          `${baseUrl}/2/tweets/${postId}`,
          {
            'tweet.fields': options.tweetFields,
            'expansions': options.expansions,
            'user.fields': options.userFields
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

    it('should handle errors when getting a post', async () => {
      // Mock data
      const postId = '1234567890';
      const mockError = new Error('Failed to get post');

      // Setup mock implementation to throw an error
      getMock.mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.get(postId))
        .rejects.toThrow('Failed to get post');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPosts', () => {
    it('should get multiple posts by IDs', async () => {
      // Mock data
      const postIds = ['1234567890', '9876543210'];
      const mockResponse: Omit<RCResponseSimple<IGetPostsResponse>, 'status' | 'rateLimitInfo'> = {
        data: {
          data: [
            {
              id: '1234567890',
              text: 'Hello, Twitter!'
            },
            {
              id: '9876543210',
              text: 'Another tweet'
            }
          ]
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.getMultiple(postIds);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith(
          `${baseUrl}/2/tweets`,
          { ids: postIds },
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

    it('should get multiple posts with additional fields and expansions', async () => {
      // Mock data
      const postIds = ['1234567890', '9876543210'];
      const options = {
        tweetFields: ['created_at', 'public_metrics'] as TweetField[],
        expansions: ['attachments.media_keys'] as ExpansionPost[],
        mediaFields: ['url', 'preview_image_url'] as MediaField[]
      };
      const mockResponse: Omit<RCResponseSimple<IGetPostsResponse>,  'status' | 'rateLimitInfo'> = {
        data: {
          data: [
            {
              id: '1234567890',
              text: 'Hello with media!',
              created_at: '2023-01-01T12:00:00Z',
              attachments: {
                media_keys: ['media-1']
              },
              public_metrics: {
                retweet_count: 5,
                reply_count: 2,
                like_count: 10,
                quote_count: 1
              }
            },
            {
              id: '9876543210',
              text: 'Another tweet',
              created_at: '2023-01-02T12:00:00Z',
              public_metrics: {
                retweet_count: 0,
                reply_count: 0,
                like_count: 2,
                quote_count: 0
              }
            }
          ],
          includes: {
            media: [
              {
                media_key: 'media-1',
                type: 'photo',
                url: 'https://example.com/image.jpg',
                preview_image_url: 'https://example.com/preview.jpg'
              }
            ]
          }
        },
        ok: true,
        headers: new Headers()
      };

      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.getMultiple(postIds, options);

      if (requestClient.isSuccessResponse(result)) {
        // Assertions
        expect(getHeadersMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledTimes(1);
        expect(getMock).toHaveBeenCalledWith(
          `${baseUrl}/2/tweets`,
          {
            ids: postIds,
            'tweet.fields': options.tweetFields,
            'expansions': options.expansions,
            'media.fields': options.mediaFields
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

    it('should handle errors when getting multiple posts', async () => {
      // Mock data
      const postIds = ['1234567890', '9876543210'];
      const mockError = new Error('Failed to get posts');

      // Setup mock implementation to throw an error
      getMock.mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.getMultiple(postIds))
        .rejects.toThrow('Failed to get posts');

      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledTimes(1);
    });
  });
});
