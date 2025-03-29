import nock from 'nock';
import type { TwitterClient } from '../../src';
import type { IErrorResponse } from '../../src/types/x-api/base_response';
import type { ISuccessGetMeResponse } from '../../src/types/x-api/users/get_me_response';
import { initializeTwitterClient, Config, initializeNock, getFixtureResponse } from './helpers';

// Type guard to check if response is an error
function isErrorResponse(response: any): response is IErrorResponse {
  return ('errors' in response) || ('title' in response);
}

/**
 * TODO: Need paid plan to test this
 */
describe('Likes Integration Tests', () => {
//   let twitterClient: TwitterClient;
//   let recordingMode: boolean;
  
  // beforeAll(async () => {
  //   recordingMode = Config.recordingMode;
  //   twitterClient = initializeTwitterClient(Config);
  //   initializeNock(nock, 'likes', recordingMode);
  // });

  it('needs a paid plan to be tested', async () => {
    expect(true).toBe(true);
  });
  
  // describe('add', () => {
    // it('should like a post', async () => {
    //   // Get the authenticated user ID
    //   const meResponse = getFixtureResponse('users', 'getMeValidFields.json');
    //   const userId = meResponse.data.id;

    //   // Get a post ID to like (from a fixture or create one)
    //   const postResponse = getFixtureResponse('posts', 'createPostSuccess.json');
    //   const postId = postResponse.data.id;
      
    //   // Like the post
    //   const { nockDone } = await nock.back('likePostSuccess.json');
    //   const response = await twitterClient.likes.add(userId, postId);
    //   nockDone();
    //   if (isErrorResponse(response)) {
    //     fail('Expected successful response but got error');
    //   } else {
    //     expect(response.data.liked).toBe(true);
    //   }
    // });

    // it('should fail when using an invalid user ID', async () => {
    //   const { nockDone } = await nock.back('likePostInvalidUserId.json');
      
    //   const invalidUserId = 'invalid-user-id';
    //   const postResponse = getFixtureResponse('posts', 'createPostSuccess.json');
    //   const postId = postResponse.data.id;
      
    //   const response = await twitterClient.likes.add(invalidUserId, postId);
    //   nockDone();
      
    //   if (isErrorResponse(response)) {
    //     const errorResp = response as IErrorResponse;
    //     expect(errorResp.title).toBe('Invalid Request');
    //     expect(errorResp.type).toBe('https://api.twitter.com/2/problems/invalid-request');
    //   } else {
    //     fail('Expected error response but got success');
    //   }
    // });

    // it('should fail when using a non-existent post ID', async () => {
    //   const { nockDone } = await nock.back('likeNonExistentPost.json');
      
    //   const meResponse = getFixtureResponse('users', 'getMeValidFields.json');
    //   const userId = meResponse.data.id;
      
    //   const nonExistentPostId = '9999999999999999999';
      
    //   const response = await twitterClient.likes.add(userId, nonExistentPostId);
    //   nockDone();
      
    //   if (isErrorResponse(response)) {
    //     const errorResp = response as IErrorResponse;
    //     expect(['Not Found Error', 'Invalid Request']).toContain(errorResp.title);
    //     expect(errorResp.type).toContain('problems');
    //   } else {
    //     fail('Expected error response but got success');
    //   }
    // });
  // });
});
