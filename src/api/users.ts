import { IUsers } from "src/interfaces/api/IUsers";
import { IOAuth1Auth } from "src/interfaces/auth/IOAuth1Auth";
import { IOAuth2Auth } from "src/interfaces/auth/IOAuth2Auth";
import { ExpansionUser, GetMeQuery } from "src/types/x-api/get_me_query";
import { GetMeResponse } from "src/types/x-api/get_me_response";
import { UserField, TweetField } from "src/types/x-api/shared";
import { httpClient } from "src/utils/http-client";

export class Users implements IUsers {
  constructor(private readonly baseUrl: string, private readonly oAuth1: IOAuth1Auth, private readonly oAuth2: IOAuth2Auth) {}

  async getMe(
    userFields: UserField[] = ['id', 'username'],
    expansions?: ExpansionUser[],
    tweetFields?: TweetField[]
  ): Promise<GetMeResponse> {
    const headers = await this.oAuth2.getHeaders();

    const data: GetMeQuery = {
      'user.fields': userFields,
      expansions: expansions,
      'tweet.fields': tweetFields
    }

    return await httpClient.get<GetMeResponse>(`${this.baseUrl}/2/users/me`,
      data,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
  }
}
