import { Posts } from '../../../src/api/posts';
import { IOAuth1Auth } from '../../../src/interfaces/auth/IOAuth1Auth';
import { IOAuth2Auth } from '../../../src/interfaces/auth/IOAuth2Auth';
import { IRequestClient } from '../../../src/interfaces/IRequestClient';
import { ICreatePostResponse } from '../../../src/types/x-api/posts/create_post_response';
import { IDeletePostResponse, ISuccessDeletePostResponse } from '../../../src/types/x-api/posts/delete_post_response';
import { IGetPostResponse, IGetPostsResponse } from '../../../src/types/x-api/posts/get_posts_response';
import { ExpansionPost, MediaField } from '../../../src/types/x-api/posts/get_posts_query';
import { TweetField, UserField } from '../../../src/types/x-api/shared';

describe('Posts', () => {
  let posts: Posts;
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

    // Create posts instance with mocks
    posts = new Posts(baseUrl, mockOAuth1, mockOAuth2, mockRequestClient);
  });

  describe('createPost', () => {
    it('should create a post with text only', async () => {
      // Mock data
      const text = 'Hello, Twitter!';
      const mockResponse: ICreatePostResponse = {
        data: {
          id: '1234567890',
          text: text
        }
      };

      // Setup mock implementation
      (mockRequestClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.create(text);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledWith(
        `${baseUrl}/2/tweets`,
        { text },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
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
      const mockResponse: ICreatePostResponse = {
        data: {
          id: '1234567890',
          text: text
        }
      };

      // Setup mock implementation
      (mockRequestClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.create(text, options);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledWith(
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
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when creating a post', async () => {
      // Mock data
      const text = 'Hello, Twitter!';
      const mockError = new Error('Failed to create post');

      // Setup mock implementation to throw an error
      (mockRequestClient.post as jest.Mock).mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.create(text))
        .rejects.toThrow('Failed to create post');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('deletePost', () => {
    it('should delete a post successfully', async () => {
      // Mock data
      const postId = '1234567890';
      const mockResponse: IDeletePostResponse = {
        data: {
          deleted: true
        }
      };

      // Setup mock implementation
      (mockRequestClient.delete as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.delete(postId) as ISuccessDeletePostResponse;

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.delete).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.delete).toHaveBeenCalledWith(
        `${baseUrl}/2/tweets/${postId}`,
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
      expect(result.data.deleted).toBe(true);
    });

    it('should handle errors when deleting a post', async () => {
      // Mock data
      const postId = '1234567890';
      const mockError = new Error('Failed to delete post');

      // Setup mock implementation to throw an error
      (mockRequestClient.delete as jest.Mock).mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.delete(postId))
        .rejects.toThrow('Failed to delete post');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPost', () => {
    it('should get a post by ID', async () => {
      // Mock data
      const postId = '1234567890';
      const mockResponse: IGetPostResponse = {
        data: {
          id: postId,
          text: 'Hello, Twitter!'
        }
      };

      // Setup mock implementation
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.get(postId);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
        `${baseUrl}/2/tweets/${postId}`,
        {},
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get a post with additional fields and expansions', async () => {
      // Mock data
      const postId = '1234567890';
      const options = {
        tweetFields: ['author_id', 'created_at', 'public_metrics'] as TweetField[],
        expansions: ['author_id'] as ExpansionPost[],
        userFields: ['name', 'username', 'verified'] as UserField[]
      };
      const mockResponse: IGetPostResponse = {
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
      };

      // Setup mock implementation
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.get(postId, options);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
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
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when getting a post', async () => {
      // Mock data
      const postId = '1234567890';
      const mockError = new Error('Failed to get post');

      // Setup mock implementation to throw an error
      (mockRequestClient.get as jest.Mock).mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.get(postId))
        .rejects.toThrow('Failed to get post');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPosts', () => {
    it('should get multiple posts by IDs', async () => {
      // Mock data
      const postIds = ['1234567890', '9876543210'];
      const mockResponse: IGetPostsResponse = {
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
      };

      // Setup mock implementation
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.getMultiple(postIds);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
        `${baseUrl}/2/tweets`,
        { ids: postIds },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should get multiple posts with additional fields and expansions', async () => {
      // Mock data
      const postIds = ['1234567890', '9876543210'];
      const options = {
        tweetFields: ['created_at', 'public_metrics'] as TweetField[],
        expansions: ['attachments.media_keys'] as ExpansionPost[],
        mediaFields: ['url', 'preview_image_url'] as MediaField[]
      };
      const mockResponse: IGetPostsResponse = {
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
      };

      // Setup mock implementation
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);

      // Call the method
      const result = await posts.getMultiple(postIds, options);

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
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
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when getting multiple posts', async () => {
      // Mock data
      const postIds = ['1234567890', '9876543210'];
      const mockError = new Error('Failed to get posts');

      // Setup mock implementation to throw an error
      (mockRequestClient.get as jest.Mock).mockRejectedValueOnce(mockError);

      // Call the method and expect it to throw
      await expect(posts.getMultiple(postIds))
        .rejects.toThrow('Failed to get posts');

      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
    });
  });
});
