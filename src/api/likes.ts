import { AbstractLikes } from "../interfaces/api/ILikes";
import type { ILikePostQuery } from "../types/x-api/likes/like_post_query";
import type { ILikePostResponse } from "../types/x-api/likes/like_post_response";

export class Likes extends AbstractLikes {
  /**
   * Likes a post.
   *
   * @param userId - The ID of the user to like the post
   * @param postId - The ID of the post to like
   * @returns A promise that resolves to the like post response
   *
   */
  async add(userId: string, postId: string) {
    const headers = await this.oAuth2.getHeaders();
    const data: ILikePostQuery = {
      tweet_id: postId
    }
    return await this.requestClient.post<ILikePostResponse>(`${this.baseUrl}/2/users/${userId}/likes`,
      data,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
  }
}
