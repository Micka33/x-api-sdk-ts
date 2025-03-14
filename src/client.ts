import axios, { AxiosRequestConfig } from 'axios';
import { ITwitterClient, RequestOptions } from './interfaces/ITwitterClient';
import { IAuth } from './interfaces/IAuth';
import { ITweets } from './interfaces/ITweets';
import { IMedia } from './interfaces/IMedia';
import { IUsers } from './interfaces/IUsers';
import { ISearches } from './interfaces/ISearches';
import { IStreams } from './interfaces/IStreams';
import { OAuth1Auth, OAuth1Config } from './auth/OAuth1Auth';
import { OAuth2Auth, OAuth2Config } from './auth/OAuth2Auth';
import { parseTwitterError } from './utils/error';
import { buildUrl } from './utils/request';

/**
 * Configuration for the Twitter client.
 */
export type TwitterClientConfig = OAuth1Config | OAuth2Config;

/**
 * The main client for interacting with the Twitter API.
 */
export class TwitterClient implements ITwitterClient {
  private auth: IAuth;
  private baseUrl: string;

  /**
   * Creates a new TwitterClient instance.
   * 
   * @param config - The client configuration
   * @param tweets - The tweets module
   * @param media - The media module
   * @param users - The users module
   * @param searches - The searches module
   * @param streams - The streams module
   * @param auth - The authentication provider
   */
  constructor(
    private config: TwitterClientConfig,
    public tweets: ITweets,
    public media: IMedia,
    public users: IUsers,
    public searches: ISearches,
    public streams: IStreams,
    auth?: IAuth
  ) {
    this.auth = auth || this.createAuthProvider(config);
    this.baseUrl = 'https://api.twitter.com';
  }

  /**
   * Creates a new TwitterClient instance with default modules.
   * 
   * @param config - The client configuration
   * @returns A new TwitterClient instance
   */
  static createClient(config: TwitterClientConfig): ITwitterClient {
    const auth = 'apiKey' in config
      ? new OAuth1Auth(config as OAuth1Config)
      : new OAuth2Auth(config as OAuth2Config);

    // In a real implementation, we would create instances of the API modules here
    // For now, we'll just use empty objects that satisfy the interfaces
    const tweets = {} as ITweets;
    const media = {} as IMedia;
    const users = {} as IUsers;
    const searches = {} as ISearches;
    const streams = {} as IStreams;

    return new TwitterClient(
      config,
      tweets,
      media,
      users,
      searches,
      streams,
      auth
    );
  }

  /**
   * Makes an authenticated request to the Twitter API.
   * 
   * @param options - The request options
   * @returns A promise that resolves to the response data
   */
  async request<T>(options: RequestOptions): Promise<T> {
    const url = options.url.startsWith('http')
      ? options.url
      : `${this.baseUrl}${options.url}`;

    const fullUrl = buildUrl(url, options.params);

    try {
      const headers = await this.auth.getHeaders(
        fullUrl,
        options.method,
        options.isMedia ? undefined : options.params
      );

      const requestConfig: AxiosRequestConfig = {
        url: fullUrl,
        method: options.method,
        headers: {
          ...headers,
          ...options.headers,
        },
        data: options.data,
      };

      const response = await axios(requestConfig);
      return response.data;
    } catch (error) {
      throw parseTwitterError(error);
    }
  }

  /**
   * Creates an authentication provider based on the client configuration.
   * 
   * @param config - The client configuration
   * @returns An authentication provider
   */
  private createAuthProvider(config: TwitterClientConfig): IAuth {
    if ('apiKey' in config) {
      return new OAuth1Auth(config as OAuth1Config);
    } else {
      return new OAuth2Auth(config as OAuth2Config);
    }
  }
}
