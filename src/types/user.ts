/**
 * Represents a user on Twitter.
 */
export interface User {
  /** The unique identifier of the user */
  id: string;
  
  /** The name of the user */
  name: string;
  
  /** The username (handle) of the user */
  username: string;
  
  /** The creation date of the user's account */
  created_at?: string;
  
  /** The user's description/bio */
  description?: string;
  
  /** The location specified in the user's profile */
  location?: string;
  
  /** The URL specified in the user's profile */
  url?: string;
  
  /** Whether the user is protected (private) */
  protected?: boolean;
  
  /** Whether the user is verified */
  verified?: boolean;
  
  /** The number of followers the user has */
  followers_count?: number;
  
  /** The number of users the user is following */
  following_count?: number;
  
  /** The number of tweets the user has posted */
  tweet_count?: number;
  
  /** The number of lists the user is a member of */
  listed_count?: number;
  
  /** The user's profile image URL */
  profile_image_url?: string;
  
  /** The user's profile banner URL */
  profile_banner_url?: string;
  
  /** Whether the authenticated user is following this user */
  following?: boolean;
  
  /** Whether the user follows the authenticated user */
  follows_you?: boolean;
  
  /** Whether the authenticated user has blocked this user */
  blocking?: boolean;
  
  /** Whether the authenticated user has muted this user */
  muting?: boolean;
  
  /** Entities extracted from the user's profile */
  entities?: {
    url?: {
      urls: Array<{
        url: string;
        expanded_url: string;
        display_url: string;
        indices: number[];
      }>;
    };
    description?: {
      urls: Array<{
        url: string;
        expanded_url: string;
        display_url: string;
        indices: number[];
      }>;
      hashtags: Array<{
        text: string;
        indices: number[];
      }>;
      mentions: Array<{
        screen_name: string;
        name: string;
        id: string;
        indices: number[];
      }>;
    };
  };
}

/**
 * Options for looking up users.
 */
export interface UserLookupOptions {
  /** User fields to include in the response */
  userFields?: Array<
    | 'created_at'
    | 'description'
    | 'entities'
    | 'id'
    | 'location'
    | 'name'
    | 'pinned_tweet_id'
    | 'profile_image_url'
    | 'protected'
    | 'public_metrics'
    | 'url'
    | 'username'
    | 'verified'
    | 'withheld'
  >;
  
  /** Tweet fields to include in the response */
  tweetFields?: Array<
    | 'attachments'
    | 'author_id'
    | 'context_annotations'
    | 'conversation_id'
    | 'created_at'
    | 'entities'
    | 'geo'
    | 'id'
    | 'in_reply_to_user_id'
    | 'lang'
    | 'public_metrics'
    | 'possibly_sensitive'
    | 'referenced_tweets'
    | 'reply_settings'
    | 'source'
    | 'text'
    | 'withheld'
  >;
  
  /** Expansions to include in the response */
  expansions?: Array<
    | 'pinned_tweet_id'
  >;
}
