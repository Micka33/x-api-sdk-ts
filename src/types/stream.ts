/**
 * Options for creating a Twitter stream.
 */
export interface StreamOptions {
  /** Keywords to track */
  track?: string[];
  
  /** User IDs to follow */
  follow?: string[];
  
  /** Locations to track (as coordinate pairs) */
  locations?: number[][];
  
  /** The language of the tweets to return */
  language?: string[];
  
  /** Whether to include replies in the stream */
  replies?: 'all' | 'none';
  
  /** Whether to include retweets in the stream */
  retweets?: boolean;
  
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
  
  /** The backfill minutes for the stream (v2 API) */
  backfillMinutes?: number;
}
