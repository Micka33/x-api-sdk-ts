import { AbstractPosts } from './api/IPosts';
import { AbstractMedia } from './api/IMedia';
import { AbstractUsers } from './api/IUsers';
import { AbstractLikes } from './api/ILikes';
import { AbstractOAuth2Auth } from './auth/IOAuth2Auth';
import { AbstractOAuth1Auth } from './auth/IOAuth1Auth';

/**
 * Interface for the Twitter client.
 * Provides access to the Twitter API through various modules.
 */
export interface ITwitterClient {
  /** The OAuth1 authentication provider */
  oAuth1: AbstractOAuth1Auth | undefined;
  /** The OAuth2 authentication provider */
  oAuth2: AbstractOAuth2Auth;
  /** Module for interacting with tweets */
  posts: AbstractPosts;
  /** Module for interacting with media */
  media: AbstractMedia;
  /** Module for interacting with users */
  users: AbstractUsers;
  /** Module for interacting with likes */
  likes: AbstractLikes;
}
