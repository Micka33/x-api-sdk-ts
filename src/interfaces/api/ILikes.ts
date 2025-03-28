import { ILikePostResponse } from "../../types/x-api/likes/like_post_response";

/**
 * Interface for the Likes module.
 * Provides methods for interacting with likes on Twitter.
 */
export interface ILikes {


  /**
   * Likes a post.
   *
   * @param userId - The ID of the user to like the post
   * @param postId - The ID of the post to like
   * @returns A promise that resolves when the post is liked
   */
  add(userId: string, postId: string): Promise<ILikePostResponse>;
}
