import { DeletePostResponse } from 'src/types/x-api/delete_post_response';
import { GetPostResponse, GetPostsResponse } from 'src/types/x-api/get_posts_response';
import { PostOptions } from 'types/post';
import { CreatePostResponse } from 'src/types/x-api/create_post_response';

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
  getPost(id: string, options?: {
    tweetFields?: string[];
    expansions?: string[];
    mediaFields?: string[];
    pollFields?: string[];
    userFields?: string[];
    placeFields?: string[];
  }): Promise<GetPostResponse>;

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
  getPosts(ids: string[], options?: {
    tweetFields?: string[];
    expansions?: string[];
    mediaFields?: string[];
    pollFields?: string[];
    userFields?: string[];
    placeFields?: string[];
  }): Promise<GetPostsResponse>;

  /**
   * Deletes a tweet.
   *
   * @param id - The ID of the tweet to delete
   * @returns A promise that resolves when the tweet is deleted
   */
  deletePost(id: string): Promise<DeletePostResponse>;
}
