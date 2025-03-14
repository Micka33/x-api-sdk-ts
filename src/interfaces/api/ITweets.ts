import { Tweet, TweetOptions } from 'types/tweet';

/**
 * Interface for the Tweets module.
 * Provides methods for interacting with tweets.
 */
export interface ITweets {
  /**
   * Posts a new tweet.
   *
   * @param text - The text content of the tweet
   * @param options - Optional parameters for the tweet
   * @returns A promise that resolves to the created tweet
   */
  postTweet(text: string, options?: TweetOptions): Promise<Tweet>;

  /**
   * Retrieves a tweet by ID.
   *
   * @param id - The ID of the tweet to retrieve
   * @returns A promise that resolves to the tweet
   */
  getTweet(id: string): Promise<Tweet>;

  /**
   * Deletes a tweet.
   *
   * @param id - The ID of the tweet to delete
   * @returns A promise that resolves when the tweet is deleted
   */
  deleteTweet(id: string): Promise<void>;

  /**
   * Likes a tweet.
   *
   * @param id - The ID of the tweet to like
   * @returns A promise that resolves when the tweet is liked
   */
  likeTweet(id: string): Promise<void>;

  /**
   * Unlikes a tweet.
   *
   * @param id - The ID of the tweet to unlike
   * @returns A promise that resolves when the tweet is unliked
   */
  unlikeTweet(id: string): Promise<void>;

  /**
   * Retweets a tweet.
   *
   * @param id - The ID of the tweet to retweet
   * @returns A promise that resolves to the retweet
   */
  retweet(id: string): Promise<Tweet>;

  /**
   * Unretweets a tweet.
   *
   * @param id - The ID of the tweet to unretweet
   * @returns A promise that resolves when the tweet is unretweeted
   */
  unretweet(id: string): Promise<void>;

  /**
   * Retrieves the timeline of the authenticated user.
   *
   * @param options - Optional parameters for the timeline request
   * @returns A promise that resolves to an array of tweets
   */
  getHomeTimeline(options?: { count?: number; since_id?: string; max_id?: string }): Promise<Tweet[]>;
}
