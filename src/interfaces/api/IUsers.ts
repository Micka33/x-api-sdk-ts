import { ExpansionUser } from "src/types/x-api/users/get_me_query";
import { IGetMeResponse } from "src/types/x-api/users/get_me_response";
import { TweetField, UserField } from "src/types/x-api/shared";

export interface IUsers {
  /**
   * Retrieves the authenticated user's profile information.
   * 
   * @param userFields - Optional fields to include in the response (default: ['id', 'username'])
   * @param expansions - Optional expansions to include in the response
   * @param tweetFields - Optional tweet fields to include in the response
   * @returns A promise that resolves to the authenticated user's profile information
   * 
   * @example
   * ```typescript
   * const user = await users.getMe();
   * console.log(user); // { data: { id: '1234567890', username: 'testuser' } }
   * ```
   */
  getMe(userFields?: UserField[], expansions?: ExpansionUser[], tweetFields?: TweetField[]): Promise<IGetMeResponse>;
}
