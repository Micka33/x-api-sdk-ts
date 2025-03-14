import type { ITwitterClient } from 'interfaces/ITwitterClient';
import type { IPosts } from 'src/interfaces/api/IPosts';
import type { IMedia } from 'interfaces/api/IMedia';
import type { IUsers } from 'interfaces/api/IUsers';
import type { ISearches } from 'interfaces/api/ISearches';
import type { IStreams } from 'interfaces/api/IStreams';
import type { IOAuth1Auth, IOAuth1Config } from 'interfaces/auth/IOAuth1Auth';
import type { IOAuth2Auth, IOAuth2Config } from 'interfaces/auth/IOAuth2Auth';
import { OAuth1Auth } from 'auth/OAuth1Auth';
import { OAuth2Auth } from 'auth/OAuth2Auth';

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
  public posts: IPosts;
  public media: IMedia;
  public users: IUsers;
  public searches: ISearches;
  public streams: IStreams;

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
      searches?: ISearches;
      streams?: IStreams;
    } | null,
    auth?: {
      oAuth1?: IOAuth1Auth;
      oAuth2?: IOAuth2Auth;
    } | null,
  ) {
    this.oAuth1 = auth?.oAuth1 || new OAuth1Auth(this.config.oAuth1);
    this.oAuth2 = auth?.oAuth2 || new OAuth2Auth(this.config.oAuth2);
    this.baseUrl = 'https://api.twitter.com';
    this.posts = apiModules?.posts || ({} as IPosts);
    this.media = apiModules?.media || ({} as IMedia);
    this.users = apiModules?.users || ({} as IUsers);
    this.searches = apiModules?.searches || ({} as ISearches);
    this.streams = apiModules?.streams || ({} as IStreams);
  }
}
