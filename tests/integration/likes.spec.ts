import nock from 'nock';
import type { IGenericError, TwitterClient } from '../../src';
import { initializeTwitterClient, Config, initializeNock, getFixtureResponse } from './helpers';

/**
 * TODO: Need paid plan to test this
 */
describe('Likes Integration Tests', () => {
  let twitterClient: TwitterClient;
  let recordingMode: boolean;
  
  beforeAll(async () => {
    recordingMode = Config.recordingMode;
    twitterClient = initializeTwitterClient(Config);
    initializeNock(nock, 'likes', recordingMode);
  });
  
  describe('add', () => {
    it('should fail with forbidden error', async () => {

      // Get the authenticated user ID
      const meResponse = getFixtureResponse('users', 'getMeValidFields.json');
      const userId = meResponse.data.id;

      // Get a post ID
      const postResponse = getFixtureResponse('posts', 'createPostSuccess.json');
      const postId = postResponse.data.id;

      const { nockDone } = await nock.back('likePostFordiddenApi.json');
      const response = await twitterClient.likes.add(userId, postId);
      nockDone();

      if (twitterClient.isErrorResponse(response)) {
        expect(response.status).toBe(403);
        const errorResp = response.data as IGenericError;
        expect(errorResp.title).toBe('Forbidden');
        expect(errorResp.type).toBe('about:blank');
        expect(errorResp.status).toBe(403);
        expect(errorResp.detail).toBe('Forbidden');
      } else {
        fail('Expected error response but got success');
      }
    });
  });
});
