/**
 * Represents a tweet on Twitter.
 */
export interface Post {
  /** The unique identifier of the tweet */
  id: string;
  
  /** The text content of the tweet */
  text: string;
  
  /** The creation date of the tweet */
  created_at?: string;
  
  /** The ID of the user who created the tweet */
  author_id?: string;
  
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
export interface PostOptions {
  /** Card URI parameter. Mutually exclusive with quote_tweet_id, poll, media, and direct_message_deep_link */
  card_uri?: string;
  
  /** The unique identifier of the Community associated with the post */
  community_id?: string;
  
  /** A link to shift the conversation to a private Direct Message. Mutually exclusive with card_uri, quote_tweet_id, poll, and media */
  direct_message_deep_link?: string;
  
  /** Indicates if the post is exclusive to super followers */
  for_super_followers_only?: boolean;
  
  /** Attaches a geo location to the post via a Place ID */
  geo?: {
    /** The unique identifier of the place */
    place_id: string;
  };
  
  /** Media details to attach to the post. Mutually exclusive with quote_tweet_id, poll, card_uri, and direct_message_deep_link */
  media?: {
    /** List of Media IDs to include in the post */
    media_ids: string[];
    /** List of User IDs tagged in the media */
    tagged_user_ids?: string[];
  };
  
  /** If true, the post is nullcasted (promoted-only), not appearing in the public timeline */
  nullcast?: boolean;
  
  /** Configures a poll for the post. Mutually exclusive with media, quote_tweet_id, card_uri, and direct_message_deep_link */
  poll?: {
    /** Duration of the poll in minutes (5-10080) */
    duration_minutes: number;
    /** Text options for the poll choices */
    options: string[];
    /** Defines who can reply to the poll */
    reply_settings?: 'following' | 'mentionedUsers';
  };
  
  /** The unique identifier of the tweet being quoted. Mutually exclusive with card_uri, poll, media, and direct_message_deep_link */
  quote_tweet_id?: string;
  
  /** Details of the tweet being replied to */
  reply?: {
    /** The unique identifier of the tweet being replied to */
    in_reply_to_tweet_id: string;
    /** List of User IDs to exclude from the reply */
    exclude_reply_user_ids?: string[];
  };
  
  /** Specifies who can reply to the post */
  reply_settings?: 'following' | 'mentionedUsers' | 'subscribers';
}
