import { RequestClient } from './utils/request';

// Export the client
export { TwitterClient } from './client';
export type { ITwitterClientConfig as TwitterClientConfig } from './client';

// Export apis
export { Posts } from 'api/posts';
export { Media } from 'api/media';

// Export utils
export { httpClient, get, post, put, del, patch } from 'utils/http-client';
export { RequestClient } from 'utils/request';
export type { RequestOptions } from 'utils/request';

// Export interfaces
export type { ITwitterClient } from 'interfaces/ITwitterClient';
export type { IPosts as ITweets } from 'src/interfaces/api/IPosts';
export type { IMedia } from 'interfaces/api/IMedia';

// Export authentication
export { OAuth1Auth } from 'auth/OAuth1Auth';
export type {
  IOAuth1Config,
  IOAuth1Auth,
  IOAuth1Token,
  IOAuth1AuthorizationHeaders,
} from 'interfaces/auth/IOAuth1Auth';
export { OAuth2Auth } from 'auth/OAuth2Auth';
export type { IOAuth2Config, IOAuth2Auth } from 'interfaces/auth/IOAuth2Auth';

// Export x-api types
// queries
export type { AddMetadataQuery } from 'types/x-api/add_metadata_query';
export type { CreatePostQuery } from 'types/x-api/create_post_query';
export type { Expansion, GetPostQuery, GetPostsQuery } from 'types/x-api/get_posts_query';
export type { GetUploadStatusQuery } from 'types/x-api/get_upload_status_query';
export type { UploadMediaQuery, AppendParams, Command, FinalizeParams, InitParams, MediaCategory } from 'types/x-api/upload_media_query';
// responses
export type { AddMetadataResponse } from 'types/x-api/add_metadata_response';
export type { CreatePostResponse } from 'types/x-api/create_post_response';
export type { DeletePostResponse } from 'types/x-api/delete_post_response';
export type { GetPostResponse, GetPostsResponse, GetPostsResponseData, GetPostsResponseIncludes } from 'types/x-api/get_posts_response';
export type { GetUploadStatusResponse } from 'types/x-api/get_upload_status_response';
export type { UploadMediaResponse } from 'types/x-api/upload_media_response';

// Export utilities
export { TwitterError, TwitterAPIError, RateLimitError, AuthenticationError } from 'utils/error';
export { parseRateLimitHeaders, isRateLimitExceeded, getTimeUntilReset } from 'utils/rate-limit';
export type { RateLimitInfo } from 'utils/rate-limit';

