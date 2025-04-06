import { IBaseResponse } from "../base_response";
/**
 * Response type for the DELETE /2/tweets/{id} endpoint.
 * Represents the response when deleting a post.
 */
export interface IDeletePostResponse extends IBaseResponse<{
    /**
     * Indicates whether the post was successfully deleted.
     * @example true
     */
    deleted: boolean;
  }> {};
