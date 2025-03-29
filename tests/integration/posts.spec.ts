import nock from 'nock';
import type { TwitterClient } from '../../src';
import type { IErrorResponse } from '../../src/types/x-api/base_response';
import type { ISuccessCreatePostResponse } from '../../src/types/x-api/posts/create_post_response';
import type { ISuccessGetPostResponse } from '../../src/types/x-api/posts/get_posts_response';
import type { ISuccessDeletePostResponse } from '../../src/types/x-api/posts/delete_post_response';
import { initializeTwitterClient, Config, initializeNock, getFixtureResponse } from './helpers';

describe('Posts Integration Tests', () => {
  let twitterClient: TwitterClient;
  let recordingMode: boolean;
  
  beforeAll(async () => {
    recordingMode = Config.recordingMode;
    twitterClient = initializeTwitterClient(Config);
    initializeNock(nock, 'posts', recordingMode);
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const { nockDone } = await nock.back('createPostSuccess.json');
      const postText = 'Test post from SDK integration test';
      const response = await twitterClient.posts.create(postText);
      nockDone();
      // {
      //   "data": {
      //     "edit_history_tweet_ids": [
      //       "1905993362018042115"
      //     ],
      //     "id": "1905993362018042115",
      //     "text": "Test post from SDK integration test"
      //   },
      //   "rateLimitInfo": {
      //     "limit": 1080000,
      //     "remaining": 1079998,
      //     "reset": "2025-03-29T14:53:48.000Z",
      //     "user": {
      //       "daily": {
      //         "limit": 17,
      //         "remaining": 11,
      //         "reset": "2025-03-30T12:05:08.000Z"
      //       }
      //     }
      //   }
      // }
      const successResponse = response as ISuccessCreatePostResponse;
      expect(successResponse.data.id).toBeDefined();
      expect(successResponse.data.text).toBe(postText);
    });

    it('should fail when text exceeds character limit', async () => {
      const { nockDone } = await nock.back('createPostExceedsLimit.json');
      // Create a string that exceeds the 280 character limit
      const longText = 'A'.repeat(281);
      const response = (await twitterClient.posts.create(longText)) as IErrorResponse;
      nockDone();
      expect(response.title).toBe('Forbidden');
      expect(response.type).toBe('about:blank');
      expect(response.detail).toContain('You are not permitted to perform this action.');
    });
  });

  describe('delete', () => {
    it('should delete a post by ID', async () => {
      const { nockDone } = await nock.back('deletePostSuccess.json');
      // First create a post to delete
      const createResponse = await twitterClient.posts.create('Post to be deleted');
      const successCreateResponse = createResponse as ISuccessCreatePostResponse;
      const postId = successCreateResponse.data.id;
      
      // Now delete it
      const response = await twitterClient.posts.delete(postId);
      const successDeleteResponse = response as ISuccessDeletePostResponse;
      nockDone();

      expect(successDeleteResponse.data.deleted).toBe(true);
    });

  //   it('should fail when using an invalid ID to delete a non-existent post', async () => {
  //     const { nockDone } = await nock.back('deleteNonExistentPost.json');
  //     const nonExistentId = '9999999999999999999';
  //     const response = await twitterClient.posts.delete(nonExistentId) as IErrorResponse;
  //     nockDone();
  //     console.log('response', response);
  //     console.log('JSON.stringify(response, null, 2)', JSON.stringify(response, null, 2));
  //     expect(response.title).toBe('Invalid Request');
  //     expect(response.type).toBe('https://api.twitter.com/2/problems/invalid-request');
  //   });
  });

  describe('get', () => {
    it('should retrieve a post by ID with specific fields', async () => {
      // Use a known post ID for testing
      const previousPost = getFixtureResponse('posts', 'createPostSuccess.json');
      const postId = previousPost.data.id;
      const { nockDone } = await nock.back('getPostWithFields.json');
      const response = await twitterClient.posts.get(postId, {
        tweetFields: ['created_at', 'author_id', 'public_metrics'],
        expansions: ['author_id'],
        userFields: ['name', 'username']
      });
      nockDone();
      const successResponse = response as ISuccessGetPostResponse;

      expect(successResponse.data.id).toBe(postId);
      expect(successResponse.data.text).toBeDefined();
      expect(successResponse.data.created_at).toBeDefined();
      expect(successResponse.data.author_id).toBeDefined();
      expect(successResponse.data.public_metrics).toBeDefined();
      expect(successResponse.includes?.users).toBeDefined();
      expect(successResponse.includes?.users?.[0].name).toBeDefined();
      expect(successResponse.includes?.users?.[0].username).toBeDefined();
    });

    // it('should fail when requesting a non-existing post', async () => {
    //   const { nockDone } = await nock.back('getNonExistingPost.json');
    //   const postId = '1905699223963910293';
    //   const response = await twitterClient.posts.get(postId, {
    //     tweetFields: ['created_at', 'author_id', 'public_metrics'],
    //     expansions: ['author_id'],
    //     userFields: ['name', 'username']
    //   });
    //   nockDone();
    //   const errorResponse = response as IErrorResponse;
      
    //   expect(errorResponse.errors).toBeDefined();
    //   const error = errorResponse.errors?.[0]! as {
    //     value: string;
    //     detail?: string;
    //     title: string;
    //     resource_type?: string;
    //     parameter?: string;
    //     resource_id?: string;
    //     type: string;
    //   }
    //   expect(error.value).toBe(postId);
    //   expect(error.detail).toContain('Could not find tweet with id: [');
    //   expect(error.title).toBe('Not Found Error');
    //   expect(error.resource_type).toBe('tweet');
    //   expect(error.parameter).toBe('id');
    //   expect(error.resource_id).toBe(postId);
    //   expect(error.type).toBe('https://api.twitter.com/2/problems/resource-not-found');
    // });


    // it('should fail when requesting with a invalid post id', async () => {
    //   const { nockDone } = await nock.back('getPostWithInvalidId.json');
    //   const nonExistentId = '9999999999999999999';
    //   const response = await twitterClient.posts.get(nonExistentId) as IErrorResponse;
    //   nockDone();
      
    //   expect(response.title).toBe('Invalid Request');
    //   expect(response.type).toBe('https://api.twitter.com/2/problems/invalid-request');
    // });
  });

  describe('getMultiple', () => {
    it('should retrieve multiple posts by their IDs', async () => {
      const { nockDone } = await nock.back('getMultiplePosts.json');
      const previousPost = getFixtureResponse('posts', 'createPostSuccess.json');
      const postIds = [ previousPost.data.id ];
      const response = await twitterClient.posts.getMultiple(postIds, {
        tweetFields: ['created_at', 'author_id'],
        expansions: ['author_id'],
        userFields: ['name', 'username']
      });
      nockDone();

      // We're assuming this is a success response
      const successResponse = response as any;
      expect(successResponse.data).toHaveLength(postIds.length);
      expect(successResponse.data[0].id).toBeDefined();
      expect(successResponse.data[0].text).toBeDefined();
      expect(successResponse.includes?.users).toBeDefined();
    });

    // it('should fail when requesting with invalid parameters', async () => {
    //   const { nockDone } = await nock.back('getMultiplePostsInvalidParams.json');
    //   // @ts-expect-error - Testing with invalid parameter types
    //   const response = await twitterClient.posts.getMultiple('not-an-array') as IErrorResponse;
    //   nockDone();
      
    //   expect(response.title).toBe('Invalid Request');
    //   expect(response.type).toBe('https://api.twitter.com/2/problems/invalid-request');
    // });
  });
});
