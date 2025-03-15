/**
 * Available options for reply settings.
 */
type ReplySettings = 'following' | 'mentionedUsers' | 'subscribers';

/**
 * Available options for poll reply settings.
 */
type PollReplySettings = 'following' | 'mentionedUsers';

/**
 * Represents the geo information for the tweet.
 */
interface Geo {
  /**
   * Place ID being attached to the Tweet for geo location.
   */
  place_id: string;
}

/**
 * Represents the media information for the tweet.
 */
interface Media {
  /**
   * A list of Media Ids to be attached to a created Tweet.
   */
  media_ids: string[];
  /**
   * A list of User Ids to be tagged in the media for created Tweet.
   */
  tagged_user_ids?: string[];
}

/**
 * Represents the poll options for the tweet.
 */
interface Poll {
  /**
   * Duration of the poll in minutes.
   * constraint: 5 <= x <= 10080
   */
  duration_minutes: number;
  /**
   * The text of a poll choice.
   */
  options: string[];
  /**
   * Settings to indicate who can reply to the poll.
   */
  reply_settings?: PollReplySettings;
}

/**
 * Represents the reply information for the tweet.
 */
interface Reply {
  /**
   * Unique identifier of the Tweet being replied to.
   * @example "1346889436626259968"
   */
  in_reply_to_tweet_id: string;
  /**
   * A list of User Ids to be excluded from the reply Tweet.
   */
  exclude_reply_user_ids?: string[];
}

/**
 * Represents the request body for creating a post (tweet).
 */
interface CreatePostBody {
  /**
   * Card Uri Parameter. Mutually exclusive with quote_tweet_id, poll, media, and direct_message_deep_link.
   */
  card_uri?: string;
  /**
   * The unique identifier of this Community.
   * @example "1146654567674912769"
   */
  community_id?: string;
  /**
   * Link to take the conversation from the public timeline to a private Direct Message.
   */
  direct_message_deep_link?: string;
  /**
   * Exclusive Tweet for super followers.
   * @default false
   */
  for_super_followers_only?: boolean;
  /**
   * Place ID being attached to the Tweet for geo location.
   */
  geo?: Geo;
  /**
   * Media information being attached to created Tweet. Mutually exclusive with quote_tweet_id, poll, card_uri, and direct_message_deep_link.
   */
  media?: Media;
  /**
   * Nullcasted (promoted-only) Posts do not appear in the public timeline and are not served to followers.
   * @default false
   */
  nullcast?: boolean;
  /**
   * Poll options for a Tweet with a poll. Mutually exclusive with media, quote_tweet_id, card_uri, and direct_message_deep_link.
   */
  poll?: Poll;
  /**
   * Unique identifier of the Tweet being quoted. Mutually exclusive with card_uri, poll, media, and direct_message_deep_link.
   * @example "1346889436626259968"
   */
  quote_tweet_id?: string;
  /**
   * Tweet information of the Tweet being replied to.
   */
  reply?: Reply;
  /**
   * Settings to indicate who can reply to the Tweet.
   */
  reply_settings?: ReplySettings;
  /**
   * The content of the Tweet.
   * @example "Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2 to explore Tweet\\u2026 https:\\/\\/t.co\\/56a0vZUx7i"
   */
  text?: string;
}

export interface CreatePostQuery extends CreatePostBody {}
