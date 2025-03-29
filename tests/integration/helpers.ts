import fs from 'fs';
import zlib from 'zlib';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import nock from 'nock/types/index';
import { AxiosAdapter, IHttpAdapter, TwitterApiScope, TwitterClient } from '../../src';

dotenv.config();

export const Config = {
  recordingMode: process.env.RECORD_NEW_FIXTURES === 'true',
  apiKey: process.env.API_KEY || 'x',
  apiSecret: process.env.API_SECRET || 'x',
  clientId: process.env.CLIENT_ID || 'x',
  clientSecret: process.env.CLIENT_SECRET || 'x',
  accessToken: process.env.ACCESS_TOKEN || 'x',
  refreshToken: process.env.REFRESH_TOKEN || 'x',
  tokenExpiresAt: process.env.TOKEN_EXPIRES_AT ? new Date(process.env.TOKEN_EXPIRES_AT).getTime() : Date.now() + 1000 * 60 * 60 * 24 * 30,
  scopes: [ TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.UsersRead, TwitterApiScope.OfflineAccess ],
  redirectUri: process.env.REDIRECT_URI || '',
};

export const initializeTwitterClient = (config: typeof Config) => {
  let httpAdapter: IHttpAdapter | undefined;
  // if (!config.recordingMode) {
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
  // }
  const twitterClientConfig = {
    // oAuth1: { apiKey: config.apiKey, apiSecret: config.apiSecret },
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


export const getFixtureResponse = (moduleName: string, fixtureName: string, responseIndex: number = 0) => {
  // Define the path to the fixture file
  const fixturePath = path.join(__dirname, 'fixtures', moduleName, fixtureName);
  
  // Read the fixture file
  const fixtureContent = fs.readFileSync(fixturePath, 'utf-8');
  
  // Parse the JSON content
  const nockData = JSON.parse(fixtureContent);
  
  // Extract the response
  const jsonResponse = decompressBufferToObject(nockData[responseIndex].response);
  return jsonResponse;
};

function decompressBufferToObject(response: string | Array<string> | object): any {
  let hexString: string;

  if (Array.isArray(response)) {
    hexString = response[0];
  } else if (typeof response === 'string') {
    hexString = response;
  } else {
    return response;
  }

   // Convert the hex string to a buffer
   const buffer = Buffer.from(hexString, 'hex');
  
   // Decompress the buffer (assuming gzip compression)
   const decompressedBuffer = zlib.gunzipSync(buffer);
   
   // Convert to string and parse as JSON
   const responseBody = decompressedBuffer.toString('utf-8');

   return JSON.parse(responseBody);
}