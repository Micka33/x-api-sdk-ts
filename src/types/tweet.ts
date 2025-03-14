/**
 * Represents a tweet on Twitter.
 */
export interface Tweet {
  /** The unique identifier of the tweet */
  id: string;
  
  /** The text content of the tweet */
  text: string;
  
  /** The creation date of the tweet */
  created_at: string;
  
  /** The ID of the user who created the tweet */
  author_id: string;
  
  /** Whether the tweet has been liked by the authenticated user */
  favorited?: boolean;
  
  /** Whether the tweet has been retweeted by the authenticated user */
  retweeted?: boolean;
  
  /** The number of times the tweet has been retweeted */
  retweet_count?: number;
  
  /** The number of times the tweet has been liked */
  favorite_count?: number;
  
  /** The language of the tweet */
  lang?: string;
  
  /** The source of the tweet (e.g., "Twitter Web App") */
  source?: string;
  
  /** The IDs of any media attached to the tweet */
  attachments?: {
    media_keys?: string[];
  };
  
  /** References to other tweets (e.g., for replies, quotes) */
  referenced_tweets?: Array<{
    type: 'replied_to' | 'quoted' | 'retweeted';
    id: string;
  }>;
  
  /** Entities extracted from the tweet text (e.g., hashtags, mentions) */
  entities?: {
    hashtags?: Array<{ tag: string }>;
    mentions?: Array<{ username: string }>;
    urls?: Array<{ url: string; expanded_url: string; display_url: string }>;
  };
}

/**
 * Options for posting a tweet.
 */
export interface TweetOptions {
  /** IDs of media to attach to the tweet */
  mediaIds?: string[];
  
  /** ID of a tweet to reply to */
  inReplyToStatusId?: string;
  
  /** Whether to enable auto-population of user IDs in replies */
  autoPopulateReplyMetadata?: boolean;
  
  /** Whether to exclude the tweet from replies */
  excludeReplyUserIds?: string[];
  
  /** Latitude coordinate for the tweet's location */
  lat?: number;
  
  /** Longitude coordinate for the tweet's location */
  long?: number;
  
  /** A place ID from the Twitter API */
  placeId?: string;
  
  /** Whether to display coordinates */
  displayCoordinates?: boolean;
  
  /** Whether to trim user details in the response */
  trimUser?: boolean;
  
  /** Whether to enable card URI in the response */
  cardUri?: string;
  
  /** Poll options for the tweet */
  poll?: {
    options: string[];
    durationMinutes: number;
  };
}
