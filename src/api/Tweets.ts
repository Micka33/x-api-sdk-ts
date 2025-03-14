import { IOAuth1Auth } from "interfaces/auth/IOAuth1Auth";
import { IOAuth2Auth } from "interfaces/auth/IOAuth2Auth";
import { ITweets } from "interfaces/api/ITweets";

export class Tweets implements ITweets {
  constructor(private readonly oAuth1: IOAuth1Auth, private readonly oAuth2: IOAuth2Auth) {}
}
