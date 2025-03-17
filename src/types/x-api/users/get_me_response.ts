import { IBaseResponse, IErrorResponse } from '../base_response';

/**
 * Represents a Twitter User object.
 */
interface IUser {
  /**
   * Unique identifier of this User. Returned as a string to handle large integers.
   * @example "2244994945"
   */
  id: string;

  /**
   * The friendly name of this User, as shown on their profile.
   */
  name: string;

  /**
   * The Twitter handle (screen name) of this user.
   */
  username: string;

  /**
   * Metadata about a user's affiliation.
   */
  affiliation?: IAffiliation;

  /**
   * Detailed information about the relationship between two users.
   * Possible values: 'follow_request_received', 'follow_request_sent', 'blocking', 'followed_by', 'following', 'muting'
   */
  connection_status?: ConnectionStatus[];

  /**
   * Creation time of this User.
   * @example "2013-12-14T04:35:55Z"
   */
  created_at?: string;

  /**
   * The text of this User's profile description (bio).
   */
  description?: string;

  /**
   * A list of metadata found in the User's profile description.
   */
  entities?: IEntities;

  /**
   * The location specified in the User's profile. May not indicate a valid location.
   */
  location?: string;

  /**
   * Unique identifier of the User's most recent Tweet.
   * @example "1346889436626259968"
   */
  most_recent_tweet_id?: string;

  /**
   * Unique identifier of the User's pinned Tweet.
   * @example "1346889436626259968"
   */
  pinned_tweet_id?: string;

  /**
   * The URL to the profile banner for this User.
   */
  profile_banner_url?: string;

  /**
   * The URL to the profile image for this User.
   */
  profile_image_url?: string;

  /**
   * Indicates if this User has chosen to protect their Tweets (i.e., if their Tweets are private).
   */
  protected?: boolean;

  /**
   * A list of metrics for this User.
   */
  public_metrics?: IPublicMetrics;

  /**
   * Indicates if you can send a Direct Message to this User.
   */
  receives_your_dm?: boolean;

  /**
   * The Twitter Blue subscription type of the user.
   * Possible values: 'Basic', 'Premium', 'PremiumPlus', 'None'
   */
  subscription_type?: SubscriptionType;

  /**
   * The URL specified in the User's profile.
   */
  url?: string;

  /**
   * Indicates if this User is a verified Twitter User.
   */
  verified?: boolean;

  /**
   * The Twitter Blue verified type of the user.
   * Possible values: 'blue', 'government', 'business', 'none'
   */
  verified_type?: VerifiedType;

  /**
   * Indicates withholding details for withheld content.
   */
  withheld?: IWithheld;
}

/**
 * Metadata about a user's affiliation.
 */
interface IAffiliation {
  /**
   * The badge URL corresponding to the affiliation.
   */
  badge_url?: string;

  /**
   * The description of the affiliation.
   */
  description?: string;

  /**
   * The URL, if available, to details about an affiliation.
   */
  url?: string;

  /**
   * Unique identifier of the affiliated user. Returned as a string to handle large integers.
   * Note: The spec lists this as string[], but the description implies a single ID. Adjusted to string for consistency.
   */
  user_id?: string;
}

/**
 * Type of connection between users.
 */
type ConnectionStatus =
  | 'follow_request_received'
  | 'follow_request_sent'
  | 'blocking'
  | 'followed_by'
  | 'following'
  | 'muting';

/**
 * A list of metadata found in the User's profile description or URL.
 */
interface IEntities {
  /**
   * Entities found in the user's description.
   */
  description?: IDescriptionEntities;

  /**
   * URLs found in the user's profile URL.
   */
  url?: {
    urls?: IUrl[];
  };
}

/**
 * Entities found in the user's description.
 */
interface IDescriptionEntities {
  /**
   * Annotations based on the Tweet text.
   */
  annotations?: IAnnotation[];

  /**
   * Cashtags found in the description.
   */
  cashtags?: ICashtag[];

  /**
   * Hashtags found in the description.
   */
  hashtags?: IHashtag[];

  /**
   * User mentions found in the description.
   */
  mentions?: IMention[];

  /**
   * URLs found in the description.
   */
  urls?: IUrl[];
}

/**
 * Annotation for entities based on the Tweet text.
 */
interface IAnnotation {
  /**
   * Index (zero-based) at which position this entity ends. The index is inclusive.
   * Required range: >= 0
   * @example 61
   */
  end: number;

  /**
   * Index (zero-based) at which position this entity starts. The index is inclusive.
   * Required range: >= 0
   * @example 50
   */
  start: number;

  /**
   * Text used to determine annotation.
   * @example "Barack Obama"
   */
  normalized_text?: string;

  /**
   * Confidence factor for annotation type.
   * Required range: 0 <= x <= 1
   */
  probability?: number;

  /**
   * Annotation type.
   * @example "Person"
   */
  type?: string;
}

/**
 * Represents a cashtag in the description.
 */
interface ICashtag {
  /**
   * Index (zero-based) at which position this entity ends. The index is exclusive.
   * Required range: >= 0
   * @example 61
   */
  end: number;

  /**
   * Index (zero-based) at which position this entity starts. The index is inclusive.
   * Required range: >= 0
   * @example 50
   */
  start: number;

  /**
   * The cashtag text.
   * @example "TWTR"
   */
  tag: string;
}

/**
 * Represents a hashtag in the description.
 */
interface IHashtag {
  /**
   * Index (zero-based) at which position this entity ends. The index is exclusive.
   * Required range: >= 0
   * @example 61
   */
  end: number;

  /**
   * Index (zero-based) at which position this entity starts. The index is inclusive.
   * Required range: >= 0
   * @example 50
   */
  start: number;

  /**
   * The hashtag text.
   * @example "MondayMotivation"
   */
  tag: string;
}

/**
 * Represents a user mention in the description.
 */
interface IMention {
  /**
   * Index (zero-based) at which position this entity ends. The index is exclusive.
   * Required range: >= 0
   * @example 61
   */
  end: number;

  /**
   * Index (zero-based) at which position this entity starts. The index is inclusive.
   * Required range: >= 0
   * @example 50
   */
  start: number;

  /**
   * The Twitter handle (screen name) of the mentioned user.
   */
  username: string;

  /**
   * Unique identifier of the mentioned user. Returned as a string to handle large integers.
   * @example "2244994945"
   */
  id?: string;
}

/**
 * Represents a URL in the description or profile URL.
 */
interface IUrl {
  /**
   * Index (zero-based) at which position this entity ends. The index is exclusive.
   * Required range: >= 0
   * @example 61
   */
  end: number;

  /**
   * Index (zero-based) at which position this entity starts. The index is inclusive.
   * Required range: >= 0
   * @example 50
   */
  start: number;

  /**
   * A validly formatted URL.
   * @example "https://developer.twitter.com/en/docs/twitter-api"
   */
  url: string;

  /**
   * Description of the URL landing page.
   * @example "This is a description of the website."
   */
  description?: string;

  /**
   * The URL as displayed in the Twitter client.
   * @example "twittercommunity.com/t/introducing-…"
   */
  display_url?: string;

  /**
   * A validly formatted URL.
   * @example "https://developer.twitter.com/en/docs/twitter-api"
   */
  expanded_url?: string;

  /**
   * Images associated with the URL.
   */
  images?: IImage[];

  /**
   * The Media Key identifier for this attachment.
   */
  media_key?: string;

  /**
   * HTTP Status Code.
   * Required range: 100 <= x <= 599
   */
  status?: number;

  /**
   * Title of the page the URL points to.
   * @example "Introducing the v2 follow lookup endpoints"
   */
  title?: string;

  /**
   * Fully resolved URL.
   * @example "https://twittercommunity.com/t/introducing-the-v2-follow-lookup-endpoints/147118"
   */
  unwound_url?: string;
}

/**
 * Represents an image associated with a URL.
 */
interface IImage {
  /**
   * The height of the media in pixels.
   * Required range: >= 0
   */
  height?: number;

  /**
   * A validly formatted URL.
   * @example "https://developer.twitter.com/en/docs/twitter-api"
   */
  url?: string;

  /**
   * The width of the media in pixels.
   * Required range: >= 0
   */
  width?: number;
}

/**
 * A list of metrics for this User.
 */
interface IPublicMetrics {
  /**
   * Number of Users who are following this User.
   */
  followers_count: number;

  /**
   * Number of Users this User is following.
   */
  following_count: number;

  /**
   * The number of lists that include this User.
   */
  listed_count: number;

  /**
   * The number of Tweets (including Retweets) posted by this User.
   */
  tweet_count: number;

  /**
   * The number of likes created by this User.
   */
  like_count?: number;
}

/**
 * The Twitter Blue subscription type of the user.
 */
type SubscriptionType = 'Basic' | 'Premium' | 'PremiumPlus' | 'None';

/**
 * The Twitter Blue verified type of the user.
 */
type VerifiedType = 'blue' | 'government' | 'business' | 'none';

/**
 * Indicates withholding details for withheld content.
 */
interface IWithheld {
  /**
   * Provides a list of countries where this content is not available.
   * A two-letter ISO 3166-1 alpha-2 country code.
   */
  country_codes: string[];

  /**
   * Indicates that the content being withheld is a user.
   * Possible value: 'user'
   */
  scope?: 'user';
}

export interface ISuccessGetMeResponse extends IBaseResponse<IUser> {}
export type IGetMeResponse = ISuccessGetMeResponse | IErrorResponse;
