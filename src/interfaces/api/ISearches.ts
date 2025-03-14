import { Post } from 'src/types/post';
import { SearchOptions, SearchResponse } from 'types/search';

/**
 * Interface for the Searches module.
 * Provides methods for searching tweets on Twitter.
 */
export interface ISearches {
  /**
   * Searches for tweets using the standard search API (v1.1).
   *
   * @param query - The search query
   * @param options - Optional parameters for the search
   * @returns A promise that resolves to the search response
   */
  search(query: string, options?: SearchOptions): Promise<SearchResponse>;

  /**
   * Searches for tweets using the recent search API (v2).
   *
   * @param query - The search query
   * @param options - Optional parameters for the search
   * @returns A promise that resolves to an array of tweets
   */
  searchRecent(query: string, options?: SearchOptions): Promise<Post[]>;

  /**
   * Searches for tweets using the full archive search API (v2).
   * Requires Academic Research access level.
   *
   * @param query - The search query
   * @param options - Optional parameters for the search
   * @returns A promise that resolves to an array of tweets
   */
  searchAll(query: string, options?: SearchOptions): Promise<Post[]>;
}
