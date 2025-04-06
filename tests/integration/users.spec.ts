import nock from 'nock';
import type { TwitterClient } from '../../src';
import { initializeTwitterClient, Config, initializeNock } from './helpers';
import type { IInvalidRequestError } from '../../src/types/x-api/error_responses';

describe('Users Integration Tests', () => {
  let twitterClient: TwitterClient;
  let recordingMode: boolean;
  
  beforeAll(async () => {
    recordingMode = Config.recordingMode;
    twitterClient = initializeTwitterClient(Config);
    initializeNock(nock, 'users', recordingMode);
  });

  describe('getMe', () => {
    it('should return the authenticated user', async () => {
      const { nockDone } = await nock.back('getMeValidFields.json');
      const response = await twitterClient.users.getMe(['name', 'username', 'profile_image_url']);
      nockDone();
      if (twitterClient.isSuccessResponse(response)) {
        const data = response.data;
        expect(data.data.name).toBe('Dr History');
        expect(data.data.username).toBe('DrHistoryX');
        expect(data.data.profile_image_url).toBe('https://pbs.twimg.com/profile_images/1882107024604794881/4PiELgpa_normal.jpg');
      } else {
        fail('Expected success response but got error');
      }
    });

    it('should fail when a wrong field is requested', async () => {
      const { nockDone } = await nock.back('getMeInvalidFields.json');
      // @ts-expect-error - Testing error handling
      const response = (await twitterClient.users.getMe(['id', 'wrong_field']));
      nockDone();
      if (twitterClient.isErrorResponse(response)) {
        const error = response.data as IInvalidRequestError;
        expect(error.title).toBe('Invalid Request');
        expect(error.type).toBe('https://api.twitter.com/2/problems/invalid-request');
        expect(error.detail).toContain('One or more parameters to your request was invalid.');
        const errorItem = error.errors?.[0] as {
          message: string;
          parameters: Record<string, string | string[]>;
        };
        expect(errorItem.message).toContain('[wrong_field] is not one of');
        expect(errorItem.parameters['user.fields'][0]).toBe(['id,wrong_field'][0]);
      } else {
        fail('Expected error response but got success');
      }
    });
  });
});
