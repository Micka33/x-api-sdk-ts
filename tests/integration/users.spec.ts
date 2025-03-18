import { AxiosAdapter, IHttpAdapter, TwitterApiScope, TwitterClient } from '../../src';
import path from 'path';
import nock from 'nock';
import dotenv from 'dotenv';
import { ISuccessGetMeResponse } from '../../src/types/x-api/users/get_me_response';
import { IErrorResponse } from '../../src/types/x-api/base_response';
import axios from 'axios';

dotenv.config();

describe('Users Integration Tests', () => {
  let twitterClient: TwitterClient;
  let recordingMode: boolean;
  
  beforeAll(async () => {
    recordingMode = process.env.RECORD_NEW_FIXTURES === 'true';
    const apiKey = process.env.API_KEY || '';
    const apiSecret = process.env.API_SECRET || '';
    const clientId = process.env.CLIENT_ID || '';
    const clientSecret = process.env.CLIENT_SECRET || '';
    const accessToken = process.env.ACCESS_TOKEN || '';
    const refreshToken = process.env.REFRESH_TOKEN || '';
    const tokenExpiresAt = process.env.TOKEN_EXPIRES_AT ? new Date(process.env.TOKEN_EXPIRES_AT).getTime() : Date.now() + 1000 * 60 * 60 * 24 * 30;
    const scopes = [ TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.UsersRead, TwitterApiScope.OfflineAccess ];
    const redirectUri = 'http://localhost:3000/oauth2/callback';
    const config = {
      oAuth1: { apiKey, apiSecret },
      oAuth2: { clientId, clientSecret, scopes, redirectUri, accessToken, refreshToken, tokenExpiresAt },
    };
    let httpAdapter: IHttpAdapter | undefined;
    if (!recordingMode) {
      /**
       * Only use http adapter in non recording mode.
       * The default adapter is fetch, but it's not supported properly by nock.
       * 
       * When replaying fixtures and using fetch, Nock doesn't pass the headers back.
       * When using FetchAdapter, RequestClient.handleResponse doesn't find `content-type` and return the response as text
       * 
       * @see: https://github.com/nock/nock/issues/2832
       */
      axios.defaults.adapter = 'http';
      httpAdapter = new AxiosAdapter(axios);
    }
    twitterClient = new TwitterClient(config, {httpAdapter});

    nock.back.fixtures = path.join(__dirname, 'fixtures', 'users');
    if (recordingMode) {
      nock.back.setMode('record');
    } else {
      nock.back.setMode('lockdown'); // or dryrun
    }
  });
  afterAll(() => {
    if (!recordingMode) {
    } else {
    }
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
      expect(response.errors?.[0].message).toContain('The `user.fields` query parameter value [wrong_field] is not one of [affiliation,connection_status,created_at,description,entities,id,is_identity_verified,location,most_recent_tweet_id,name,parody,pinned_tweet_id,profile_banner_url,profile_image_url,protected,public_metrics,receives_your_dm,subscription,subscription_type,url,username,verified,verified_followers_count,verified_type,withheld]');
      expect(response.errors?.[0].parameters?.['user.fields'][0]).toBe(['id,wrong_field'][0]);
    });
  });
});
