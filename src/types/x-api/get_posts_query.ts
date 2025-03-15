import { TweetField, UserField } from "./shared";

/**
 * Available expansions for the 'expansions' query parameter.
 */
export type ExpansionPost =
  | 'article.cover_media'
  | 'article.media_entities'
  | 'attachments.media_keys'
  | 'attachments.media_source_tweet'
  | 'attachments.poll_ids'
  | 'author_id'
  | 'edit_history_tweet_ids'
  | 'entities.mentions.username'
  | 'geo.place_id'
  | 'in_reply_to_user_id'
  | 'entities.note.mentions.username'
  | 'referenced_tweets.id'
  | 'referenced_tweets.id.attachments.media_keys'
  | 'referenced_tweets.id.author_id';

/**
 * Available media fields for the 'media.fields' query parameter.
 */
export type MediaField =
  | 'alt_text'
  | 'duration_ms'
  | 'height'
  | 'media_key'
  | 'non_public_metrics'
  | 'organic_metrics'
  | 'preview_image_url'
  | 'promoted_metrics'
  | 'public_metrics'
  | 'type'
  | 'url'
  | 'variants'
  | 'width';

/**
 * Available poll fields for the 'poll.fields' query parameter.
 */
export type PollField =
  | 'duration_minutes'
  | 'end_datetime'
  | 'id'
  | 'options'
  | 'voting_status';

/**
 * Available place fields for the 'place.fields' query parameter.
 */
export type PlaceField =
  | 'contained_within'
  | 'country'
  | 'country_code'
  | 'full_name'
  | 'geo'
  | 'id'
  | 'name'
  | 'place_type';

/**
 * Represents the query parameters for retrieving a single post by its ID.
 * ID passed in the path.
 */
interface GetPostQueryParams {
  /**
   * A list of Tweet fields to display.
   * @example ["author_id", "created_at", "text"]
   */
  'tweet.fields'?: TweetField[];

  /**
   * A list of fields to expand.
   * @example ["author_id", "referenced_tweets.id"]
   */
  expansions?: ExpansionPost[];

  /**
   * A list of Media fields to display.
   * @example ["media_key", "url", "type"]
   */
  'media.fields'?: MediaField[];

  /**
   * A list of Poll fields to display.
   * @example ["id", "options", "voting_status"]
   */
  'poll.fields'?: PollField[];

  /**
   * A list of User fields to display.
   * @example ["name", "username", "verified"]
   */
  'user.fields'?: UserField[];

  /**
   * A list of Place fields to display.
   * @example ["full_name", "country", "geo"]
   */
  'place.fields'?: PlaceField[];
}

/**
 * Represents the query parameters for retrieving multiple posts by their IDs.
 */
interface GetPostsQueryParams extends GetPostQueryParams {
  /**
   * A list of Post IDs. Up to 100 are allowed in a single request.
   * @example ["1346889436626259968", "1346889436626259969"]
   */
  ids: string[];
}

export interface GetPostQuery extends GetPostQueryParams {}
export interface GetPostsQuery extends GetPostsQueryParams {}
