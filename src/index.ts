// Export the client
export { TwitterClient } from './client';
export type { ITwitterClientConfig } from './client';

// Export Http Adapters
export type { IHttpAdapter, IHttpFetchResponse } from './interfaces/IHttpAdapter';
export { AxiosAdapter } from './adapters/axios-adapter';
export { FetchAdapter } from './adapters/fetch-adapter';

// Export apis
export { Likes } from './api/likes';
export { Media } from './api/media';
export { Posts } from './api/posts';
export { Users } from './api/users';

// Export utils
export { RequestClient } from './utils/request';
export { AbstractRequestClient } from './interfaces/IRequestClient';
export type { RequestOptions, RCResponse, RCResponseSimple } from './interfaces/IRequestClient';

// Export interfaces and abstract classes
export type { ITwitterClient } from './interfaces/ITwitterClient';
export type { IPostOptions } from './interfaces/api/IPosts';
export type { IApiConstructor } from './interfaces/api/IApiConstructor';
export { AbstractApi } from './interfaces/api/IApiConstructor';
export { AbstractPosts } from './interfaces/api/IPosts';
export { AbstractMedia } from './interfaces/api/IMedia';
export { AbstractUsers } from './interfaces/api/IUsers';
export { AbstractLikes } from './interfaces/api/ILikes';

// Export authentication
export type { IOAuth2Config } from './interfaces/auth/IOAuth2Auth';
export type { IOAuthConstructor } from './interfaces/auth/IOAuthConstructor';
export { AbstractOAuthConstructor } from './interfaces/auth/IOAuthConstructor';
export { AbstractOAuth2Auth } from './interfaces/auth/IOAuth2Auth';
export { OAuth2Auth } from './auth/OAuth2Auth';

// Export x-api types
// likes
export type { ILikePostQuery } from './types/x-api/likes/like_post_query';
export type { ILikePostResponse } from './types/x-api/likes/like_post_response';
// media
export type { IAddMetadataQuery } from './types/x-api/media/add_metadata_query';
export type { IAddMetadataResponse } from './types/x-api/media/add_metadata_response';
export type { IGetUploadStatusQuery } from './types/x-api/media/get_upload_status_query';
export type { IUploadMediaQuery, IAppendParams, Command, IFinalizeParams, IInitParams, MediaCategory } from './types/x-api/media/upload_media_query';
export type { IGetUploadStatusResponse } from './types/x-api/media/get_upload_status_response';
export type { IUploadMediaResponse } from './types/x-api/media/upload_media_response';
// posts
export type { ICreatePostQuery } from './types/x-api/posts/create_post_query';
export type { ExpansionPost, IGetPostQuery, IGetPostsQuery } from './types/x-api/posts/get_posts_query';
export type { ICreatePostResponse } from './types/x-api/posts/create_post_response';
export type { IDeletePostResponse } from './types/x-api/posts/delete_post_response';
export type { IGetPostResponse, IGetPostsResponse, IGetPostsResponseData, IGetPostsResponseIncludes } from './types/x-api/posts/get_posts_response';
// users
export type { IGetMeQuery, ExpansionUser } from './types/x-api/users/get_me_query';
export type { IGetMeResponse } from './types/x-api/users/get_me_response';
// shared
export type { TweetField, UserField, NullablePartial } from './types/x-api/shared';
export { TwitterApiScope } from './types/x-api/shared';
// base_response
export type { IBaseResponse, ICustomBaseResponse, IRateLimitInfo } from './types/x-api/base_response';
// Error responses
export type {
  IXError,
  IGenericError,
  IForbiddenError,
  IResourceViolationError,
  IDuplicateRuleError,
  IInvalidRequestError,
  IForbiddenFieldAccessError,
  IForbiddenResourceAccessError,
  IDisconnectedError,
  IResourceNotFoundError,
  IResourceNotAvailableToYouError,
  IConnectionIssueError,
  IUsageCapExceededError
} from './types/x-api/error_responses';
// Export utilities
export { TwitterError, TwitterAPIError, RateLimitError, AuthenticationError } from './utils/error';
export { parseRateLimitHeaders, isRateLimitExceeded, getTimeUntilReset } from './utils/rate-limit';
