import type { ITwitterClient } from './interfaces/ITwitterClient';
import type { AbstractPosts } from './interfaces/api/IPosts';
import type { AbstractMedia } from './interfaces/api/IMedia';
import type { AbstractUsers } from './interfaces/api/IUsers';
import { AbstractLikes } from './interfaces/api/ILikes';
import type { IApiConstructor } from './interfaces/api/IApiConstructor';
import type { AbstractOAuth1Auth } from './interfaces/auth/IOAuth1Auth';
import type { AbstractOAuth2Auth, IOAuth2Config } from './interfaces/auth/IOAuth2Auth';
import type { AbstractRequestClient, IRequestClientConstructor, RCResponse, RCResponseSimple } from './interfaces/IRequestClient';
// import { OAuth1Auth } from './auth/OAuth1Auth';
import { OAuth2Auth } from './auth/OAuth2Auth';
import { RequestClient } from './utils/request';
import { Posts } from './api/posts';
import { Media } from './api/media';
import { Users } from './api/users';
import { Likes } from './api/likes';
import { IHttpAdapter } from './interfaces/IHttpAdapter';
import { FetchAdapter } from './adapters/fetch-adapter';
import { IOAuthConstructor } from './interfaces/auth/IOAuthConstructor';

/**
 * Configuration for the Twitter client.
 */
export type ITwitterClientConfig = {
  // oAuth1: IOAuth1Config;
  oAuth2: IOAuth2Config;
};

export type IHttpAdapterInjection = [new (...args: any[]) => IHttpAdapter, ...any[]];

/**
 * The main client for interacting with the Twitter API.
 */
export class TwitterClient implements ITwitterClient {
  public readonly oAuth1: AbstractOAuth1Auth | undefined;
  public readonly oAuth2: AbstractOAuth2Auth;
  private baseUrl: string;
  private requestClient: AbstractRequestClient;
  private httpAdapter: IHttpAdapter;
  public readonly posts: AbstractPosts;
  public readonly media: AbstractMedia;
  public readonly users: AbstractUsers;
  public readonly likes: AbstractLikes;

  /**
   * Creates a new TwitterClient instance.
   *
   * @param config - The client configuration (required)
   * @param apiModules - The API modules (optional)
   * @param auth - The authentication providers (optional)
   */
  constructor(
    private config: ITwitterClientConfig,
    options?: {
      baseUrl?: string | null,
      httpAdapter?: IHttpAdapterInjection,
      requestClient?: IRequestClientConstructor,
      auth?: {
        // oAuth1?: { new (): IOAuth1Auth };
        oAuth2?: IOAuthConstructor<IOAuth2Config, AbstractOAuth2Auth>;
      } | null,
      apiModules?: ({
        posts?: IApiConstructor<AbstractPosts>;
        media?: IApiConstructor<AbstractMedia>;
        users?: IApiConstructor<AbstractUsers>;
        likes?: IApiConstructor<AbstractLikes>;
      } | null),
    },
  ) {
    const { apiModules, requestClient, auth, baseUrl, httpAdapter } = options || {};
    this.baseUrl = baseUrl || 'https://api.x.com';
    const httpAdapterConstructor = httpAdapter ? httpAdapter[0] : FetchAdapter;
    const httpAdapterParams = httpAdapter ? httpAdapter.slice(1) : [];
    this.httpAdapter = new httpAdapterConstructor(...httpAdapterParams);
    this.requestClient = requestClient ? new requestClient(this.httpAdapter) : new RequestClient(this.httpAdapter);
    // this.oAuth1 = auth?.oAuth1 || new OAuth1Auth(this.config.oAuth1);
    this.oAuth2 = auth?.oAuth2 ? new auth.oAuth2(this.config.oAuth2, this.httpAdapter) : new OAuth2Auth(this.config.oAuth2, this.httpAdapter);
    this.posts = apiModules?.posts ? new apiModules.posts(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient) : new Posts(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
    this.media = apiModules?.media ? new apiModules.media(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient) : new Media(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
    this.users = apiModules?.users ? new apiModules.users(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient) : new Users(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
    this.likes = apiModules?.likes ? new apiModules.likes(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient) : new Likes(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
  }

  public isSuccessResponse<T>(response: RCResponse<T>): response is RCResponseSimple<T> {
    return this.requestClient.isSuccessResponse(response);
  }
  public isErrorResponse<T>(response: RCResponse<T>): response is RCResponse<never> {
    return !this.isSuccessResponse(response);
  }
}
