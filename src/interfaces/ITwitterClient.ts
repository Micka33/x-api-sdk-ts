import { IPosts } from './api/IPosts';
import { IMedia } from './api/IMedia';
import { IUsers } from './api/IUsers';
import { ILikes } from './api/ILikes';

/**
 * Interface for the Twitter client.
 * Provides access to the Twitter API through various modules.
 */
export interface ITwitterClient {
  /** Module for interacting with tweets */
  posts: IPosts;
  /** Module for interacting with media */
  media: IMedia;
  /** Module for interacting with users */
  users: IUsers;
  /** Module for interacting with likes */
  likes: ILikes;
}
