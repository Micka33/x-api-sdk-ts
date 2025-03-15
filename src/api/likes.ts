import { ILikes } from "interfaces/api/ILikes";
import { IOAuth1Auth } from "src/interfaces/auth/IOAuth1Auth";
import { IOAuth2Auth } from "src/interfaces/auth/IOAuth2Auth";
import { LikePostQuery } from "src/types/x-api/like_post_query";
import { LikePostResponse } from "src/types/x-api/like_post_response";
import { httpClient } from "src/utils/http-client";

export class Likes implements ILikes {
  constructor(private readonly baseUrl: string, private readonly oAuth1: IOAuth1Auth, private readonly oAuth2: IOAuth2Auth) {}
  
  /**
   * Likes a post.
   *
   * @param userId - The ID of the user to like the post
   * @param postId - The ID of the post to like
   * @returns A promise that resolves to the like post response
   */
  async likePost(userId: string, postId: string): Promise<LikePostResponse> {
    const headers = await this.oAuth2.getHeaders();
    const data: LikePostQuery = {
      tweet_id: postId
    }
    return await httpClient.post<LikePostResponse>(`${this.baseUrl}/2/users/${userId}/likes`,
      data,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
  }
}
