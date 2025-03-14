import { DeletePostResponse } from 'src/types/responses/delete_post_response';
import { Post, PostOptions } from 'types/post';
import { CreatePostResponse } from 'types/responses/create_post_response';

/**
 * Interface for the Posts module.
 * Provides methods for interacting with posts.
 */
export interface IPosts {
  /**
   * Posts a new tweet.
   *
   * @param text - The text content of the tweet
   * @param options - Optional parameters for the tweet
   * @returns A promise that resolves to the created tweet
   */
  createPost(text: string, options?: PostOptions): Promise<CreatePostResponse>;

  /**
   * Retrieves a tweet by ID.
   *
   * @param id - The ID of the tweet to retrieve
   * @returns A promise that resolves to the tweet
   */
  getPosts(ids: string[]): Promise<Post>;

  /**
   * Deletes a tweet.
   *
   * @param id - The ID of the tweet to delete
   * @returns A promise that resolves when the tweet is deleted
   */
  deletePost(id: string): Promise<DeletePostResponse>;

  /**
   * Likes a tweet.
   *
   * @param id - The ID of the tweet to like
   * @returns A promise that resolves when the tweet is liked
   */
  likePost(id: string): Promise<void>;

  /**
   * Unlikes a tweet.
   *
   * @param id - The ID of the tweet to unlike
   * @returns A promise that resolves when the tweet is unliked
   */
  unlikePost(id: string): Promise<void>;

  /**
   * Retweets a tweet.
   *
   * @param id - The ID of the tweet to retweet
   * @returns A promise that resolves to the retweet
   */
  repost(id: string): Promise<Post>;

  /**
   * Unretweets a tweet.
   *
   * @param id - The ID of the tweet to unretweet
   * @returns A promise that resolves when the tweet is unretweeted
   */
  unrepost(id: string): Promise<void>;

  /**
   * Retrieves the timeline of the authenticated user.
   *
   * @param options - Optional parameters for the timeline request
   * @returns A promise that resolves to an array of tweets
   */
  getHomeTimeline(options?: { count?: number; since_id?: string; max_id?: string }): Promise<Post[]>;
}
