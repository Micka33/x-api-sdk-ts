import { Tweet } from './tweet';

/**
 * Options for searching tweets.
 */
export interface SearchOptions {
  /** The maximum number of results to return */
  count?: number;
  
  /** Returns results with an ID greater than (newer than) the specified ID */
  sinceId?: string;
  
  /** Returns results with an ID less than (older than) the specified ID */
  maxId?: string;
  
  /** The language of the tweets to return */
  lang?: string;
  
  /** The locale of the tweets to return */
  locale?: string;
  
  /** The type of search results to return */
  resultType?: 'mixed' | 'recent' | 'popular';
  
  /** The number of tweets to return per page */
  maxResults?: number;
  
  /** The next token for pagination */
  nextToken?: string;
  
  /** The start time for the search (ISO 8601 format) */
  startTime?: string;
  
  /** The end time for the search (ISO 8601 format) */
  endTime?: string;
  
  /** Whether to include entities in the response */
  includeEntities?: boolean;
  
  /** Whether to include retweets in the response */
  includeRetweets?: boolean;
  
  /** Tweet fields to include in the response (v2 API) */
  tweetFields?: string[];
  
  /** User fields to include in the response (v2 API) */
  userFields?: string[];
  
  /** Media fields to include in the response (v2 API) */
  mediaFields?: string[];
  
  /** Place fields to include in the response (v2 API) */
  placeFields?: string[];
  
  /** Poll fields to include in the response (v2 API) */
  pollFields?: string[];
  
  /** Expansions to include in the response (v2 API) */
  expansions?: string[];
}

/**
 * Response from a search request.
 */
export interface SearchResponse {
  /** The search metadata */
  search_metadata?: {
    /** The completed search query */
    completed_in: number;
    
    /** The maximum ID in the result set */
    max_id: string;
    
    /** The maximum ID in the result set as a string */
    max_id_str: string;
    
    /** The next results URL */
    next_results?: string;
    
    /** The query that was used */
    query: string;
    
    /** The refresh URL */
    refresh_url?: string;
    
    /** The number of results returned */
    count: number;
    
    /** The minimum ID in the result set */
    since_id: string;
    
    /** The minimum ID in the result set as a string */
    since_id_str: string;
  };
  
  /** The tweets that matched the search query */
  statuses: Tweet[];
  
  /** The next token for pagination (v2 API) */
  next_token?: string;
  
  /** The tweets that matched the search query (v2 API) */
  data?: Tweet[];
  
  /** Metadata about the request (v2 API) */
  meta?: {
    /** The next token for pagination */
    next_token?: string;
    
    /** The number of results returned */
    result_count: number;
    
    /** The newest ID in the result set */
    newest_id: string;
    
    /** The oldest ID in the result set */
    oldest_id: string;
  };
}
