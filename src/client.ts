import type { ITwitterClient } from 'interfaces/ITwitterClient';
import type { IPosts } from 'src/interfaces/api/IPosts';
import type { IMedia } from 'interfaces/api/IMedia';
import type { IUsers } from 'interfaces/api/IUsers';
import type { ILikes } from 'interfaces/api/ILikes';
import type { IOAuth1Auth, IOAuth1Config } from 'interfaces/auth/IOAuth1Auth';
import type { IOAuth2Auth, IOAuth2Config } from 'interfaces/auth/IOAuth2Auth';
import { OAuth1Auth } from 'auth/OAuth1Auth';
import { OAuth2Auth } from 'auth/OAuth2Auth';
import { IRequestClient } from './interfaces/IRequestClient';
import { RequestClient } from './utils/request';
import { Posts } from './api/posts';
import { Media } from './api/media';
import { Users } from './api/users';
import { Likes } from './api/likes';

/**
 * Configuration for the Twitter client.
 */
export type ITwitterClientConfig = {
  oAuth1: IOAuth1Config;
  oAuth2: IOAuth2Config;
};

/**
 * The main client for interacting with the Twitter API.
 */
export class TwitterClient implements ITwitterClient {
  private oAuth1: IOAuth1Auth;
  private oAuth2: IOAuth2Auth;
  private baseUrl: string;
  private requestClient: IRequestClient;
  public posts: IPosts;
  public media: IMedia;
  public users: IUsers;
  public likes: ILikes;

  /**
   * Creates a new TwitterClient instance.
   *
   * @param config - The client configuration (required)
   * @param apiModules - The API modules (optional)
   * @param auth - The authentication providers (optional)
   */
  constructor(
    private config: ITwitterClientConfig,
    apiModules?: {
      posts?: IPosts;
      media?: IMedia;
      users?: IUsers;
      likes?: ILikes;
    } | null,
    requestClient?: IRequestClient,
    auth?: {
      oAuth1?: IOAuth1Auth;
      oAuth2?: IOAuth2Auth;
    } | null,
  ) {
    this.requestClient = requestClient || new RequestClient();
    this.oAuth1 = auth?.oAuth1 || new OAuth1Auth(this.config.oAuth1);
    this.oAuth2 = auth?.oAuth2 || new OAuth2Auth(this.config.oAuth2);
    this.baseUrl = 'https://api.twitter.com';
    this.posts = apiModules?.posts || new Posts(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
    this.media = apiModules?.media || new Media(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
    this.users = apiModules?.users || new Users(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
    this.likes = apiModules?.likes || new Likes(this.baseUrl, this.oAuth1, this.oAuth2, this.requestClient);
  }
}
