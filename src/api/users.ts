import { AbstractUsers } from "../interfaces/api/IUsers";
import type { ExpansionUser, IGetMeQuery } from "../types/x-api/users/get_me_query";
import type { IGetMeResponse } from "../types/x-api/users/get_me_response";
import type { UserField, TweetField } from "../types/x-api/shared";

export class Users extends AbstractUsers {
  /**
   * Retrieves the authenticated user's profile information.
   * 
   * @param userFields - Optional fields to include in the response (default: ['id', 'username'])
   * @param expansions - Optional expansions to include in the response
   * @param tweetFields - Optional tweet fields to include in the response
   * @returns A promise that resolves to the authenticated user's profile information
   */
  async getMe(
    userFields: UserField[] = ['id', 'username'],
    expansions?: ExpansionUser[],
    tweetFields?: TweetField[]
  ) {
    const headers = await this.oAuth2.getHeaders();

    const data: IGetMeQuery = { 'user.fields': userFields }
    if (expansions) {
      data['expansions'] = expansions;
    }
    if (tweetFields) {
      data['tweet.fields'] = tweetFields;
    }

    return await this.requestClient.get<IGetMeResponse>(
      `${this.baseUrl}/2/users/me`,
      data,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
  }
}
