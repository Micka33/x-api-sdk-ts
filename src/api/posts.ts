import type { IOAuth1Auth } from "../interfaces/auth/IOAuth1Auth";
import type { IOAuth2Auth } from "../interfaces/auth/IOAuth2Auth";
import type { IPostOptions, IPosts } from "../interfaces/api/IPosts";
import type { IRequestClient } from "../interfaces/IRequestClient";
import type { ICreatePostQuery } from "../types/x-api/posts/create_post_query";
import type { ICreatePostResponse } from "../types/x-api/posts/create_post_response";
import type { IDeletePostResponse } from "../types/x-api/posts/delete_post_response";
import type { ExpansionPost, PlaceField, IGetPostQuery, IGetPostsQuery, MediaField, PollField } from "../types/x-api/posts/get_posts_query";
import type { IGetPostResponse, IGetPostsResponse } from "../types/x-api/posts/get_posts_response";
import type { TweetField, UserField } from "../types/x-api/shared";

export class Posts implements IPosts {
  constructor(
    private readonly baseUrl: string,
    private readonly oAuth1: IOAuth1Auth,
    private readonly oAuth2: IOAuth2Auth,
    private readonly requestClient: IRequestClient
  ) {}

  /**
   * Posts a new post.
   *
   * @param text - The text content of the post
   * @param options - Optional parameters for the post
   * @returns A promise that resolves to the created post
   * @throws {AuthenticationError} When authentication fails
   * @throws {ApiError} When the API returns an error
   * 
   * @example
   * ```typescript
   * const post = await posts.createPost("Hello, Twitter!", {
   *   reply: { in_reply_to_tweet_id: "1234567890" }
   * });
   * ```
   */
  async createPost(text: string, options?: IPostOptions): Promise<ICreatePostResponse> {
    // Prepare request body
    const requestBody: ICreatePostQuery = {
      text
    };

    // Add optional parameters if provided
    if (options) {
      if (options.card_uri) requestBody.card_uri = options.card_uri;
      if (options.community_id) requestBody.community_id = options.community_id;
      if (options.direct_message_deep_link) requestBody.direct_message_deep_link = options.direct_message_deep_link;
      if (options.for_super_followers_only !== undefined) requestBody.for_super_followers_only = options.for_super_followers_only;
      if (options.nullcast !== undefined) requestBody.nullcast = options.nullcast;
      if (options.quote_tweet_id) requestBody.quote_tweet_id = options.quote_tweet_id;
      if (options.reply_settings) requestBody.reply_settings = options.reply_settings;
      
      // Add nested objects if provided
      if (options.geo) requestBody.geo = options.geo;
      if (options.media) requestBody.media = options.media;
      if (options.poll) requestBody.poll = options.poll;
      if (options.reply) requestBody.reply = options.reply;
    }

    // Gets headers with a valid access token
    const headers = await this.oAuth2.getHeaders();
    
    // Make the API request
    return await this.requestClient.post<ICreatePostResponse>(
      `${this.baseUrl}/2/tweets`,
      requestBody,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
  }

  /**
   * Deletes a post by its ID.
   *
   * @param id - The ID of the post to delete
   * @returns A promise that resolves to the deletion response
   * @throws {AuthenticationError} When authentication fails
   * @throws {ApiError} When the API returns an error
   * 
   * @example
   * ```typescript
   * const result = await posts.deletePost("1346889436626259968");
   * if (result.data.deleted) {
   *   console.log("Post successfully deleted");
   * }
   * ```
   */
  async deletePost(id: string): Promise<IDeletePostResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();

    return await this.requestClient.delete<IDeletePostResponse>(
      `${this.baseUrl}/2/tweets/${id}`,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
  }

  /**
   * Retrieves a post by its ID.
   *
   * @param id - The ID of the post to retrieve
   * @param options - Optional parameters for the request
   * @returns A promise that resolves to the post response
   * @throws {AuthenticationError} When authentication fails
   * @throws {ApiError} When the API returns an error
   * 
   * @example
   * ```typescript
   * const response = await posts.getPost("1346889436626259968", {
   *   tweetFields: ["author_id", "created_at", "public_metrics"],
   *   expansions: ["author_id"]
   * });
   * console.log(`Post by ${response.includes?.users?.[0]?.name}: ${response.data.text}`);
   * ```
   */
  async getPost(id: string, options?: {
    tweetFields?: TweetField[];
    expansions?: ExpansionPost[];
    mediaFields?: MediaField[];
    pollFields?: PollField[];
    userFields?: UserField[];
    placeFields?: PlaceField[];
  }): Promise<IGetPostResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();

    // Build query parameters
    const params: IGetPostQuery = {}

    if (options) {
      if (options.tweetFields?.length) {
        params['tweet.fields'] = options.tweetFields;
      }
      if (options.expansions?.length) {
        params.expansions = options.expansions;
      }
      if (options.mediaFields?.length) {
        params['media.fields'] = options.mediaFields;
      }
      if (options.pollFields?.length) {
        params['poll.fields'] = options.pollFields;
      }
      if (options.userFields?.length) {
        params['user.fields'] = options.userFields;
      }
      if (options.placeFields?.length) {
        params['place.fields'] = options.placeFields;
      }
    }

    return await this.requestClient.get<IGetPostResponse>(
      `${this.baseUrl}/2/tweets/${id}`,
      params,
      {
        ...headers,
        'Content-Type': 'application/json'
      },
    );
  }
  

  /**
   * Retrieves multiple posts by their IDs.
   *
   * @param ids - An array of post IDs to retrieve
   * @param options - Optional parameters for the request
   * @returns A promise that resolves to the posts response
   * @throws {AuthenticationError} When authentication fails
   * @throws {ApiError} When the API returns an error
   * 
   * @example
   * ```typescript
   * const response = await posts.getPosts(["1346889436626259968", "1346889436626259969"], {
   *   tweetFields: ["author_id", "created_at", "public_metrics"],
   *   expansions: ["author_id"]
   * });
   * console.log(`Post by ${response.includes?.users?.[0]?.name}: ${response.data[0].text}`);
   * ```
   */
  async getPosts(ids: string[], options?: {
    tweetFields?: TweetField[];
    expansions?: ExpansionPost[];
    mediaFields?: MediaField[];
    pollFields?: PollField[];
    userFields?: UserField[];
    placeFields?: PlaceField[];
  }): Promise<IGetPostsResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();

    // Build query parameters
    const params: IGetPostsQuery = { ids }

    if (options) {
      if (options.tweetFields?.length) {
        params['tweet.fields'] = options.tweetFields;
      }
      if (options.expansions?.length) {
        params.expansions = options.expansions;
      }
      if (options.mediaFields?.length) {
        params['media.fields'] = options.mediaFields;
      }
      if (options.pollFields?.length) {
        params['poll.fields'] = options.pollFields;
      }
      if (options.userFields?.length) {
        params['user.fields'] = options.userFields;
      }
      if (options.placeFields?.length) {
        params['place.fields'] = options.placeFields;
      }
    }
    
    return await this.requestClient.get<IGetPostsResponse>(
      `${this.baseUrl}/2/tweets`,
      params,
      {
        ...headers,
        'Content-Type': 'application/json'
      },
    );
  }
}
