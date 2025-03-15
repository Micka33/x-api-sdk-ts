import { TweetField, UserField } from "../shared";

/**
 * Available expansions for the 'expansions' query parameter.
 */
export type ExpansionUser =
  | "affiliation.user_id"
  | "most_recent_tweet_id"
  | "pinned_tweet_id";

interface IGetMeQueryParams {
  'user.fields'?: UserField[];
  expansions?: ExpansionUser[];
  'tweet.fields'?: TweetField[];
}

export interface IGetMeQuery extends IGetMeQueryParams {}
