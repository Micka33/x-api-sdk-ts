import { IPosts } from './api/IPosts';
import { IMedia } from './api/IMedia';
import { IUsers } from './api/IUsers';
import { ILikes } from './api/ILikes';
import { IOAuth2Auth } from './auth/IOAuth2Auth';
import { IOAuth1Auth } from './auth/IOAuth1Auth';

/**
 * Interface for the Twitter client.
 * Provides access to the Twitter API through various modules.
 */
export interface ITwitterClient {
  /** The OAuth1 authentication provider */
  oAuth1: IOAuth1Auth;
  /** The OAuth2 authentication provider */
  oAuth2: IOAuth2Auth;
  /** Module for interacting with tweets */
  posts: IPosts;
  /** Module for interacting with media */
  media: IMedia;
  /** Module for interacting with users */
  users: IUsers;
  /** Module for interacting with likes */
  likes: ILikes;
}
