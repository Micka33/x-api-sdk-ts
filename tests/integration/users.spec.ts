import nock from 'nock';
import type { TwitterClient } from '../../src';
import type { ISuccessGetMeResponse } from '../../src/types/x-api/users/get_me_response';
import type { IErrorResponse } from '../../src/types/x-api/base_response';
import { initializeTwitterClient, Config, initializeNock } from './helpers';

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
      const data = (response as ISuccessGetMeResponse).data;
      expect(data.name).toBe('Dr History');
      expect(data.username).toBe('DrHistoryX');
      expect(data.profile_image_url).toBe('https://pbs.twimg.com/profile_images/1882107024604794881/4PiELgpa_normal.jpg');
    });

    it('should fail when a wrong field is requested', async () => {
      const { nockDone } = await nock.back('getMeInvalidFields.json');
      // @ts-expect-error - Testing error handling
      const response = (await twitterClient.users.getMe(['id', 'wrong_field'])) as IErrorResponse;
      nockDone();
      expect(response.title).toBe('Invalid Request');
      expect(response.type).toBe('https://api.twitter.com/2/problems/invalid-request');
      expect(response.detail).toContain('One or more parameters to your request was invalid.');
      expect(response.errors?.[0].message).toContain('[wrong_field] is not one of');
      expect(response.errors?.[0].parameters?.['user.fields'][0]).toBe(['id,wrong_field'][0]);
    });
  });
});
