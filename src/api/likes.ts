import type { ILikes } from "../interfaces/api/ILikes";
import type { IOAuth1Auth } from "../interfaces/auth/IOAuth1Auth";
import type { IOAuth2Auth } from "../interfaces/auth/IOAuth2Auth";
import type { IRequestClient } from "../interfaces/IRequestClient";
import type { ILikePostQuery } from "../types/x-api/likes/like_post_query";
import type { ILikePostResponse } from "../types/x-api/likes/like_post_response";

export class Likes implements ILikes {
  constructor(
    private readonly baseUrl: string,
    private readonly oAuth1: IOAuth1Auth,
    private readonly oAuth2: IOAuth2Auth,
    private readonly requestClient: IRequestClient
  ) {}
  
  /**
   * Likes a post.
   *
   * @param userId - The ID of the user to like the post
   * @param postId - The ID of the post to like
   * @returns A promise that resolves to the like post response
   */
  async add(userId: string, postId: string): Promise<ILikePostResponse> {
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
