import nock from 'nock';
import type { IGenericError, TwitterClient } from '../../src';
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
      if (twitterClient.isSuccessResponse(response)) {
        expect(response.data.data.id).toBeDefined();
        expect(response.data.data.text).toBe(postText);
      } else {
        fail('Expected success response but got error');
      }
    });

    it('should fail when text exceeds character limit', async () => {
      const { nockDone } = await nock.back('createPostExceedsLimit.json');
      // Create a string that exceeds the 280 character limit
      const longText = 'A'.repeat(281);
      const response = await twitterClient.posts.create(longText);
      nockDone();
      if (twitterClient.isErrorResponse(response)) {
        const error = response.data as IGenericError;
        expect(response.status).toBe(403);
        expect(error.status).toBe(403);
        expect(error.title).toBe('Forbidden');
        expect(error.type).toBe('about:blank');
        expect(error.detail).toContain('You are not permitted to perform this action.');
      } else {
        fail('Expected error response but got success');
      }
    });
  });

  describe('delete', () => {
    it('should delete a post by ID', async () => {
      const { nockDone } = await nock.back('deletePostSuccess.json');
      // First create a post to delete
      const createResponse = await twitterClient.posts.create('Post to be deleted');
      if (twitterClient.isSuccessResponse(createResponse)) {
        const postId = createResponse.data.data.id;
        // Now delete it
        const deleteResponse = await twitterClient.posts.delete(postId);
        nockDone();
        if (twitterClient.isSuccessResponse(deleteResponse)) {
          expect(deleteResponse.data.data.deleted).toBe(true);
        } else {
          fail('Expected success response but got error');
        }
      } else {
        nockDone();
        fail('Expected success response but got error');
      }
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

      if (twitterClient.isSuccessResponse(response)) {
        expect(response.data.data.id).toBe(postId);
        expect(response.data.data.text).toBeDefined();
        expect(response.data.data.created_at).toBeDefined();
        expect(response.data.data.author_id).toBeDefined();
        expect(response.data.data.public_metrics).toBeDefined();
        expect(response.data.includes?.users).toBeDefined();
        expect(response.data.includes?.users?.[0].name).toBeDefined();
        expect(response.data.includes?.users?.[0].username).toBeDefined();
      } else {
        fail('Expected success response but got error');
      }
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

      if (twitterClient.isSuccessResponse(response)) {
        // We're assuming this is a success response
        expect(response.data.data).toHaveLength(postIds.length);
        expect(response.data.data[0].id).toBeDefined();
        expect(response.data.data[0].text).toBeDefined();
        expect(response.data.includes?.users).toBeDefined();
      } else {
        fail('Expected success response but got error');
      }
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
