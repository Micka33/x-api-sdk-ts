import fs from 'fs';
import zlib from 'zlib';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import nock from 'nock/types/index';
import { AxiosAdapter, IHttpAdapter, TwitterApiScope, TwitterClient } from '../../src';
import Joi from 'joi';

dotenv.config();

function buildConfig() {
  let config: {
    recordingMode: boolean;
    clientId: string;
    clientSecret: string;
    accessToken: string;
    refreshToken: string;
    tokenExpiresAt: number;
    scopes: TwitterApiScope[];
    redirectUri: string;
  };
  const configSchema = Joi.object<typeof config>({
    recordingMode: Joi.boolean().required(),
    clientId: Joi.string().required(),
    clientSecret: Joi.string().required(),
    accessToken: Joi.string().required(),
    refreshToken: Joi.string().required(),
    tokenExpiresAt: Joi.date().timestamp().required(),
    scopes: Joi.array<TwitterApiScope[]>().items(Joi.string().valid(...Object.values(TwitterApiScope))).required(),
    redirectUri: Joi.string().required(),
  })

  if (process.env.RECORD_NEW_FIXTURES === 'true') {
    const schemaEnv = Joi.object({
      RECORD_NEW_FIXTURES: Joi.boolean().required(),
      CLIENT_ID: Joi.string().required(),
      CLIENT_SECRET: Joi.string().required(),
      ACCESS_TOKEN: Joi.string().required(),
      REFRESH_TOKEN: Joi.string().required(),
      TOKEN_EXPIRES_AT: Joi.date().iso().required(),
      REDIRECT_URI: Joi.string().required(),
    }).unknown();
    const { error, value } = schemaEnv.validate(process.env);
    if (error) {
      throw new Error(`Invalid environment variables: ${error.message}`);
    }
    config = {
      recordingMode: true,
      clientId: value.CLIENT_ID,
      clientSecret: value.CLIENT_SECRET,
      accessToken: value.ACCESS_TOKEN,
      refreshToken: value.REFRESH_TOKEN,
      tokenExpiresAt: new Date(value.TOKEN_EXPIRES_AT).getTime(),
      scopes: [ TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.UsersRead, TwitterApiScope.OfflineAccess, TwitterApiScope.MediaWrite ],
      redirectUri: value.REDIRECT_URI,
    };
  } else {
    config = {
      recordingMode: false,
      clientId: 'x',
      clientSecret: 'x',
      accessToken: 'x',
      refreshToken: 'x',
      tokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      scopes: [ TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.UsersRead, TwitterApiScope.OfflineAccess, TwitterApiScope.MediaWrite ],
      redirectUri: 'x',
    };
  };

  const { error, value } = configSchema.validate(config);
  if (error) {
    throw new Error(`Invalid environment variables: ${error.message}`);
  }

  return value;
}

export const Config = buildConfig();

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