import { ResponseType } from "./response_type";
/**
 * Response type for the DELETE /2/tweets/{id} endpoint.
 * Represents the response when deleting a post.
 */
export interface DeletePostResponse extends ResponseType<{
    /**
     * Indicates whether the post was successfully deleted.
     * @example true
     */
    deleted: boolean;
  }> {};
