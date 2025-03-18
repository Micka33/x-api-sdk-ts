import { IBaseResponse, IErrorResponse } from "../base_response";
export interface IGetPostsResponseData {
  /**
   * Unique identifier of the post.
   * @example "1346889436626259968"
   */
  id: string;
  
  /**
   * The content of the post.
   * @example "Learn how to use the user Tweet timeline and user mention timeline endpoints in the X API v2 to explore Tweet\\u2026 https:\\/\\/t.co\\/56a0vZUx7i"
   */
  text: string;
  
  /**
   * The ID of the user who authored the post.
   * @example "2244994945"
   */
  author_id?: string;
  

  /**
   * The X handle (screen name) of this user.
   * @example "Jack"
   */
  username?: string;

  /**
   * The time when the post was created.
   * @example "2021-01-06T18:40:40.000Z"
   */
  created_at?: string;
  
  /**
   * Attachments in the post.
   */
  attachments?: {
    /**
     * A list of Media Keys for each one of the media attachments (if media are attached).
     * The Media Key identifier for this attachment.
     */
    media_keys?: string[];
    
    /**
     * A list of Posts the media on this Tweet was originally posted in.
     * For example, if the media on a tweet is re-used in another Tweet, this refers to the original, source Tweet..
     * Unique identifier of this Tweet. This is returned as a string in order to avoid complications with languages and tools that cannot handle large integers.
     */
    media_source_tweet_id?: string[];

    /**
     * A list of poll IDs (if polls are attached).
     * Unique identifier of this poll.
     */
    poll_ids?: string[];
  };
  
  /**
   * The conversation ID of the post.
   */
  conversation_id?: string;
  
  /**
   * The language of the post.
   * @example "en"
   */
  lang?: string;
  
  /**
   * The source of the post.
   * @example "Twitter Web App"
   */
  source?: string;
  
  /**
   * Public metrics for the post.
   */
  public_metrics?: {
    /**
     * Number of retweets.
     */
    retweet_count: number;
    
    /**
     * Number of replies.
     */
    reply_count: number;
    
    /**
     * Number of likes.
     */
    like_count: number;
    
    /**
     * Number of quotes.
     */
    quote_count?: number;
  };
  
  /**
   * A list of Posts this Tweet refers to.
   * For example, if the parent Tweet is a Retweet, a Quoted Tweet or a Reply,
   * it will include the related Tweet referenced to by its parent.
   */
  referenced_tweets?: Array<{
    /**
     * Type of reference.
     */
    type: 'replied_to' | 'quoted' | 'retweeted';
    
    /**
     * Unique identifier of this Tweet.
     * This is returned as a string in order to avoid complications with languages and tools that cannot handle large integers.
     */
    id: string;
  }>;
  
  /**
   * Entities extracted from the post text.
   */
  entities?: {
    /**
     * Hashtags in the post.
     */
    hashtags?: Array<{
      /**
       * The hashtag text.
       */
      tag: string;
    }>;
    
    /**
     * Mentions in the post.
     */
    mentions?: Array<{
      /**
       * The mentioned username.
       */
      username: string;
      
      /**
       * The ID of the mentioned user.
       */
      id?: string;
    }>;
    
    /**
     * URLs in the post.
     */
    urls?: Array<{
      /**
       * The URL.
       */
      url: string;
      
      /**
       * The expanded URL.
       */
      expanded_url: string;
      
      /**
       * The display URL.
       */
      display_url: string;
    }>;
  };
  
  /**
   * Reply settings for the post.
   */
  reply_settings?: 'following' | 'mentionedUsers' | 'subscribers';

  /**
   * The scope of the post.
   */
  scope?: {
    /**
     * Indicates if this Tweet is viewable by followers without the Tweet ID
     * @example false
     */
    followers?: boolean;
  }

  /**
   * Indicates withholding details for withheld content.
   */
  withheld?: {
    /**
     * Indicates if the content is being withheld for on the basis of copyright infringement.
     * @example false
     */
    copyright: boolean;
    /**
     * Provides a list of countries where this content is not available.
     * A two-letter ISO 3166-1 alpha-2 country code.
     */
    country_codes: string[];
    /**
     * Indicates whether the content being withheld is the tweet or a user.
     */
    scope?: 'tweet' | 'user';
  }
};

export interface IGetPostsResponseIncludes {
  /**
   * Users referenced in the post.
   */
  users?: Array<{
    /**
     * Unique identifier of the user.
     */
    id: string;
    
    /**
     * The name of the user.
     */
    name: string;
    
    /**
     * The username of the user.
     */
    username?: string;
    
    /**
     * Whether the user's posts are protected.
     */
    protected?: boolean;
    
    /**
     * Public metrics for the user.
     */
    public_metrics?: {
      /**
       * Number of followers.
       */
      followers_count: number;
      
      /**
       * Number of accounts the user is following.
       */
      following_count: number;
      
      /**
       * Number of posts.
       */
      tweet_count: number;
      
      /**
       * Number of lists the user is on.
       */
      listed_count: number;
      
      /**
       * Number of likes by the user.
       */
      like_count?: number;
    };
    
    /**
     * Whether the user is verified.
     */
    verified?: boolean;
    
    /**
     * The verification type of the user.
     */
    verified_type?: 'blue' | 'government' | 'business' | 'none';
  }>;
  
  /**
   * Media referenced in the post.
   */
  media?: Array<{
    /**
     * The media key.
     */
    media_key: string;
    
    /**
     * The type of media.
     */
    type: 'photo' | 'video' | 'animated_gif';
    
    /**
     * The URL of the media.
     */
    url?: string;
    
    /**
     * The preview image URL.
     */
    preview_image_url?: string;
  }>;
  
  /**
   * Polls referenced in the post.
   */
  polls?: Array<{
    /**
     * The poll ID.
     */
    id: string;
    
    /**
     * The poll options.
     */
    options: Array<{
      /**
       * The position of the option.
       */
      position: number;
      
      /**
       * The label of the option.
       */
      label: string;
      
      /**
       * The number of votes for the option.
       */
      votes: number;
    }>;
    
    /**
     * The voting status of the poll.
     */
    voting_status?: 'open' | 'closed';
  }>;
  
  /**
   * Places referenced in the post.
   */
  places?: Array<{
    /**
     * The place ID.
     */
    id: string;
    
    /**
     * The full name of the place.
     */
    full_name: string;
    
    /**
     * The country of the place.
     */
    country?: string;
    
    /**
     * The country code of the place.
     */
    country_code?: string;
  }>;
};

/**
 * Response type for the GET /2/tweets/{id} endpoint.
 * Represents the response when retrieving a post by ID.
 */
export interface ISuccessGetPostResponse extends IBaseResponse<IGetPostsResponseData> {
  /**
   * Included objects referenced in the post.
   */
  includes?: IGetPostsResponseIncludes;
}

/**
 * Response type for the GET /2/tweets/{id} endpoint.
 * Represents the response when retrieving a post by ID.
 */
export interface ISuccessGetPostsResponse extends IBaseResponse<IGetPostsResponseData[]> {
  /**
   * Included objects referenced in the post.
   */
  includes?: IGetPostsResponseIncludes;
}

export type IGetPostResponse = ISuccessGetPostResponse | IErrorResponse;
export type IGetPostsResponse = ISuccessGetPostsResponse | IErrorResponse;
