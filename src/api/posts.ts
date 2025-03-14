import { IOAuth1Auth } from "interfaces/auth/IOAuth1Auth";
import { IOAuth2Auth } from "interfaces/auth/IOAuth2Auth";
import { IPosts } from "src/interfaces/api/IPosts";
import { Post, PostOptions } from 'src/types/post';
import { CreatePostResponse } from "src/types/responses/create_post_response";

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

  // ... other methods to be implemented
  getPost(id: string): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  
  deletePost(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  likePost(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  unlikePost(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  repost(id: string): Promise<Post> {
    throw new Error("Method not implemented.");
  }
  
  unrepost(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  
  getHomeTimeline(options?: { count?: number; since_id?: string; max_id?: string; }): Promise<Post[]> {
    throw new Error("Method not implemented.");
  }
}
