import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import nock from 'nock/types/index';
import { AxiosAdapter, IHttpAdapter, TwitterApiScope, TwitterClient } from '../../src';

dotenv.config();

export const Config = {
  recordingMode: process.env.RECORD_NEW_FIXTURES === 'true',
  apiKey: process.env.API_KEY || '',
  apiSecret: process.env.API_SECRET || '',
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  accessToken: process.env.ACCESS_TOKEN || '',
  refreshToken: process.env.REFRESH_TOKEN || '',
  tokenExpiresAt: process.env.TOKEN_EXPIRES_AT ? new Date(process.env.TOKEN_EXPIRES_AT).getTime() : Date.now() + 1000 * 60 * 60 * 24 * 30,
  scopes: [ TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.UsersRead, TwitterApiScope.OfflineAccess ],
  redirectUri: process.env.REDIRECT_URI || '',
};

export const initializeTwitterClient = (config: typeof Config) => {
  let httpAdapter: IHttpAdapter | undefined;
  if (!config.recordingMode) {
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
  const twitterClientConfig = {
    oAuth1: { apiKey: config.apiKey, apiSecret: config.apiSecret },
    oAuth2: {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      scopes: config.scopes,
      redirectUri: config.redirectUri,
      accessToken: config.accessToken,
      refreshToken: config.refreshToken,
      tokenExpiresAt: config.tokenExpiresAt,
    },
  };
  const twitterClient = new TwitterClient(twitterClientConfig, {httpAdapter});

  return twitterClient;
};

export const initializeNock = (n: typeof nock, moduleName: string, shouldRecord: boolean = false) => {
  n.back.fixtures = path.join(__dirname, 'fixtures', moduleName);
  if (shouldRecord) {
    n.back.setMode('record');
  } else {
    n.back.setMode('lockdown'); // or dryrun
  }
};
