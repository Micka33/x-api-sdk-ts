import { ITweets } from './api/ITweets';
import { IMedia } from './api/IMedia';
import { IUsers } from './api/IUsers';
import { ISearches } from './api/ISearches';
import { IStreams } from './api/IStreams';

/**
 * Options for making HTTP requests to the Twitter API.
 */
export interface RequestOptions {
  /** The URL to make the request to */
  url: string;
  /** The HTTP method to use */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** Query parameters for the request */
  params?: Record<string, any>;
  /** Body data for the request */
  data?: any;
  /** Additional headers to include */
  headers?: Record<string, string>;
  /** Whether to include media in the request */
  isMedia?: boolean;
}

/**
 * Interface for the Twitter client.
 * Provides access to the Twitter API through various modules.
 */
export interface ITwitterClient {
  /** Module for interacting with tweets */
  tweets: ITweets;
  /** Module for interacting with media */
  media: IMedia;
  /** Module for interacting with users */
  users: IUsers;
  /** Module for interacting with searches */
  searches: ISearches;
  /** Module for interacting with streams */
  streams: IStreams;
}
