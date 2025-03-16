/**
 * Type representing a nullable partial object.
 * Same usage as Partial<T> but with null values.
 */
export type NullablePartial<T> = { [P in keyof T]?: T[P] | null };

/**
 * Enum representing the available scopes for the Twitter API.
 */
export enum TwitterApiScope {
  /**
   * All the Tweets you can view, including Tweets from protected accounts.
   */
  TweetRead = 'tweet.read',

  /**
   * Tweet and Retweet for you.
   */
  TweetWrite = 'tweet.write',

  /**
   * Hide and unhide replies to your Tweets.
   */
  TweetModerateWrite = 'tweet.moderate.write',

  /**
   * Any account you can view, including protected accounts.
   */
  UsersRead = 'users.read',

  /**
   * People who follow you and people who you follow.
   */
  FollowsRead = 'follows.read',

  /**
   * Follow and unfollow people for you.
   */
  FollowsWrite = 'follows.write',

  /**
   * Stay connected to your account until you revoke access.
   */
  OfflineAccess = 'offline.access',

  /**
   * All the Spaces you can view.
   */
  SpaceRead = 'space.read',

  /**
   * Accounts you’ve muted.
   */
  MuteRead = 'mute.read',

  /**
   * Mute and unmute accounts for you.
   */
  MuteWrite = 'mute.write',

  /**
   * Tweets you’ve liked and likes you can view.
   */
  LikeRead = 'like.read',

  /**
   * Like and un-like Tweets for you.
   */
  LikeWrite = 'like.write',

  /**
   * Lists, list members, and list followers of lists you’ve created or are a member of, including private lists.
   */
  ListRead = 'list.read',

  /**
   * Create and manage Lists for you.
   */
  ListWrite = 'list.write',

  /**
   * Accounts you’ve blocked.
   */
  BlockRead = 'block.read',

  /**
   * Block and unblock accounts for you.
   */
  BlockWrite = 'block.write',

  /**
   * Get Bookmarked Tweets from an authenticated user.
   */
  BookmarkRead = 'bookmark.read',

  /**
   * Bookmark and remove Bookmarks from Tweets.
   */
  BookmarkWrite = 'bookmark.write',

  /**
   * Upload media.
   */
  MediaWrite = 'media.write',
}

/**
 * Available user fields for the 'user.fields' query parameter.
 */
export type UserField =
  | 'affiliation'
  | 'connection_status'
  | 'created_at'
  | 'description'
  | 'entities'
  | 'id'
  | 'is_identity_verified'
  | 'location'
  | 'most_recent_tweet_id'
  | 'name'
  | 'parody'
  | 'pinned_tweet_id'
  | 'profile_banner_url'
  | 'profile_image_url'
  | 'protected'
  | 'public_metrics'
  | 'receives_your_dm'
  | 'subscription'
  | 'subscription_type'
  | 'url'
  | 'username'
  | 'verified'
  | 'verified_followers_count'
  | 'verified_type'
  | 'withheld';

  /**
 * Available tweet fields for the 'tweet.fields' query parameter.
 */
export type TweetField =
  | 'article'
  | 'attachments'
  | 'author_id'
  | 'card_uri'
  | 'community_id'
  | 'context_annotations'
  | 'conversation_id'
  | 'created_at'
  | 'display_text_range'
  | 'edit_controls'
  | 'edit_history_tweet_ids'
  | 'entities'
  | 'geo'
  | 'id'
  | 'in_reply_to_user_id'
  | 'lang'
  | 'media_metadata'
  | 'non_public_metrics'
  | 'note_tweet'
  | 'organic_metrics'
  | 'possibly_sensitive'
  | 'promoted_metrics'
  | 'public_metrics'
  | 'referenced_tweets'
  | 'reply_settings'
  | 'scopes'
  | 'source'
  | 'text'
  | 'withheld';
