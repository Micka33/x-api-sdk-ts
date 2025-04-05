import { IDeletePostResponse } from '../../types/x-api/posts/delete_post_response';
import { IGetPostResponse, IGetPostsResponse } from '../../types/x-api/posts/get_posts_response';
import { ICreatePostResponse } from '../../types/x-api/posts/create_post_response';
import { AbstractApiContructor } from './IApiConstructor';

/**
 * Options for posting a tweet.
 */
export interface IPostOptions {
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


/**
 * Interface for the Posts module.
 * Provides methods for interacting with posts.
 */
export abstract class AbstractPosts extends AbstractApiContructor {
  /**
   * Posts a new tweet.
   *
   * @param text - The text content of the tweet
   * @param options - Optional parameters for the tweet
   * @returns A promise that resolves to the created tweet
   */
  abstract create(text: string, options?: IPostOptions): Promise<ICreatePostResponse>;

  /**
   * Retrieves a post by its ID.
   *
   * @param id - The ID of the post to retrieve
   * @param options - Optional parameters for the request
   * @returns A promise that resolves to the post response
   * @throws {AuthenticationError} When authentication fails
   * @throws {ApiError} When the API returns an error
   * 
   * @example
   * ```typescript
   * const response = await posts.getPost("1346889436626259968", {
   *   tweetFields: ["author_id", "created_at", "public_metrics"],
   *   expansions: ["author_id"]
   * });
   * console.log(`Post by ${response.includes?.users?.[0]?.name}: ${response.data.text}`);
   * ```
   */
  abstract get(id: string, options?: {
    tweetFields?: string[];
    expansions?: string[];
    mediaFields?: string[];
    pollFields?: string[];
    userFields?: string[];
    placeFields?: string[];
  }): Promise<IGetPostResponse>;

  /**
   * Retrieves multiple posts by their IDs.
   *
   * @param ids - An array of post IDs to retrieve
   * @param options - Optional parameters for the request
   * @returns A promise that resolves to the posts response
   * @throws {AuthenticationError} When authentication fails
   * @throws {ApiError} When the API returns an error
   * 
   * @example
   * ```typescript
   * const response = await posts.getPosts(["1346889436626259968", "1346889436626259969"], {
   *   tweetFields: ["author_id", "created_at", "public_metrics"],
   *   expansions: ["author_id"]
   * });
   * console.log(`Post by ${response.includes?.users?.[0]?.name}: ${response.data.text}`);
   * ```
   */
  abstract getMultiple(ids: string[], options?: {
    tweetFields?: string[];
    expansions?: string[];
    mediaFields?: string[];
    pollFields?: string[];
    userFields?: string[];
    placeFields?: string[];
  }): Promise<IGetPostsResponse>;

  /**
   * Deletes a tweet.
   *
   * @param id - The ID of the tweet to delete
   * @returns A promise that resolves when the tweet is deleted
   */
  abstract delete(id: string): Promise<IDeletePostResponse>;
}
