import { IOAuth1Auth } from "interfaces/auth/IOAuth1Auth";
import { IOAuth2Auth } from "interfaces/auth/IOAuth2Auth";
import { IPosts } from "src/interfaces/api/IPosts";
import { Post, PostOptions } from 'src/types/post';
import { CreatePostResponse } from "src/types/responses/create_post_response";
import { DeletePostResponse } from "src/types/responses/delete_post_response";
import { GetPostResponse, GetPostsResponse } from "src/types/responses/get_posts_response";

export class Posts implements IPosts {
  constructor(private readonly baseUrl: string, private readonly oAuth1: IOAuth1Auth, private readonly oAuth2: IOAuth2Auth) {}

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
  async createPost(text: string, options?: PostOptions): Promise<CreatePostResponse> {
    // Prepare request body
    const requestBody: Record<string, any> = {
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

    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Make the API request
    const response = await fetch(this.baseUrl + '/2/tweets', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // Parse the response
    const data: CreatePostResponse = await response.json();

    return data;
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
  async deletePost(id: string): Promise<DeletePostResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Make the API request
    const response = await fetch(this.baseUrl + '/2/tweets/' + id, {
      method: 'DELETE',
      headers
    });

    // Parse the response
    const data: DeletePostResponse = await response.json();
    
    return data;
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
    tweetFields?: string[];
    expansions?: string[];
    mediaFields?: string[];
    pollFields?: string[];
    userFields?: string[];
    placeFields?: string[];
  }): Promise<GetPostResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    
    if (options) {
      if (options.tweetFields?.length) {
        queryParams.append('tweet.fields', options.tweetFields.join(','));
      }
      if (options.expansions?.length) {
        queryParams.append('expansions', options.expansions.join(','));
      }
      if (options.mediaFields?.length) {
        queryParams.append('media.fields', options.mediaFields.join(','));
      }
      if (options.pollFields?.length) {
        queryParams.append('poll.fields', options.pollFields.join(','));
      }
      if (options.userFields?.length) {
        queryParams.append('user.fields', options.userFields.join(','));
      }
      if (options.placeFields?.length) {
        queryParams.append('place.fields', options.placeFields.join(','));
      }
    }
    
    // Build the URL with query parameters
    const url = new URL(`${this.baseUrl}/2/tweets/${id}`);
    url.search = queryParams.toString();
    
    // Make the API request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    // Parse the response
    const data: GetPostResponse = await response.json();
    
    return data;
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
    tweetFields?: string[];
    expansions?: string[];
    mediaFields?: string[];
    pollFields?: string[];
    userFields?: string[];
    placeFields?: string[];
  }): Promise<GetPostsResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('ids', ids.join(','));

    if (options) {
      if (options.tweetFields?.length) {
        queryParams.append('tweet.fields', options.tweetFields.join(','));
      }
      if (options.expansions?.length) {
        queryParams.append('expansions', options.expansions.join(','));
      }
      if (options.mediaFields?.length) {
        queryParams.append('media.fields', options.mediaFields.join(','));
      }
      if (options.pollFields?.length) {
        queryParams.append('poll.fields', options.pollFields.join(','));
      }
      if (options.userFields?.length) {
        queryParams.append('user.fields', options.userFields.join(','));
      }
      if (options.placeFields?.length) {
        queryParams.append('place.fields', options.placeFields.join(','));
      }
    }
    
    // Build the URL with query parameters
    const url = new URL(this.baseUrl + '/2/tweets');
    url.search = queryParams.toString();
    
    // Make the API request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    // Parse the response
    const data: GetPostsResponse = await response.json();
    
    return data;
  }
}
