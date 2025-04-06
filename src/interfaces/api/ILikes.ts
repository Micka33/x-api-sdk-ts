import { ILikePostResponse } from "../../types/x-api/likes/like_post_response";
import { RCResponse } from "../IRequestClient";
import { AbstractApi } from "./IApiConstructor";

export abstract class AbstractLikes extends AbstractApi {
  /**
   * Likes a post.
   *
   * @param userId - The ID of the user to like the post
   * @param postId - The ID of the post to like
   * @returns A promise that resolves when the post is liked
   */
  abstract add(userId: string, postId: string): Promise<RCResponse<ILikePostResponse>>;
}
