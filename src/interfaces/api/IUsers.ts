import { ExpansionUser } from "../../types/x-api/users/get_me_query";
import { IGetMeResponse } from "../../types/x-api/users/get_me_response";
import { TweetField, UserField } from "../../types/x-api/shared";
import { AbstractApi } from "./IApiConstructor";
import { RCResponse } from "../IRequestClient";
export abstract class AbstractUsers extends AbstractApi {
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
  abstract getMe(
    userFields?: UserField[],
    expansions?: ExpansionUser[],
    tweetFields?: TweetField[]
  ): Promise<RCResponse<IGetMeResponse>>;
}
