import { IPosts } from './api/IPosts';
import { IMedia } from './api/IMedia';
import { IUsers } from './api/IUsers';
import { ISearches } from './api/ISearches';
import { IStreams } from './api/IStreams';

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
  /** Module for interacting with searches */
  searches: ISearches;
  /** Module for interacting with streams */
  streams: IStreams;
}
