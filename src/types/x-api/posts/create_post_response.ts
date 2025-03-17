import { IBaseResponse, IErrorResponse } from "../base_response";
/**
 * Response type for the POST /2/tweets endpoint.
 * Represents the response when creating a new post.
 */
export interface ISuccessCreatePostResponse extends IBaseResponse<{
    /**
     * The unique identifier of the created post.
     * @example "1346889436626259968"
     */
    id: string;
    
    /**
     * The content of the created post.
     * @example "Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2 to explore Tweet\\u2026 https:\\/\\/t.co\\/56a0vZUx7i"
     */
    text: string;
  }> {}

export type ICreatePostResponse = ISuccessCreatePostResponse | IErrorResponse;
