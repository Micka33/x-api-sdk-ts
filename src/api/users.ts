import type { IUsers } from "interfaces/api/IUsers";
import type { IOAuth1Auth } from "interfaces/auth/IOAuth1Auth";
import type { IOAuth2Auth } from "interfaces/auth/IOAuth2Auth";
import type { ExpansionUser, IGetMeQuery } from "src/types/x-api/users/get_me_query";
import type { IGetMeResponse } from "src/types/x-api/users/get_me_response";
import type { IRequestClient } from "interfaces/IRequestClient";
import type { UserField, TweetField } from "src/types/x-api/shared";

export class Users implements IUsers {
  constructor(
    private readonly baseUrl: string,
    private readonly oAuth1: IOAuth1Auth,
    private readonly oAuth2: IOAuth2Auth,
    private readonly requestClient: IRequestClient
  ) {}

  async getMe(
    userFields: UserField[] = ['id', 'username'],
    expansions?: ExpansionUser[],
    tweetFields?: TweetField[]
  ): Promise<IGetMeResponse> {
    const headers = await this.oAuth2.getHeaders();

    const data: IGetMeQuery = {
      'user.fields': userFields,
      expansions: expansions,
      'tweet.fields': tweetFields
    }

    return await this.requestClient.get<IGetMeResponse>(`${this.baseUrl}/2/users/me`,
      data,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
  }
}
