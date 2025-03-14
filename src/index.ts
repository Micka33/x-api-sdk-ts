// Export the client
export { TwitterClient } from './client';
export type { ITwitterClientConfig as TwitterClientConfig } from './client';

// Export interfaces
export type { ITwitterClient, RequestOptions } from 'interfaces/ITwitterClient';
export type { IPosts as ITweets } from 'src/interfaces/api/IPosts';
export type { IMedia } from 'interfaces/api/IMedia';
export type { IUsers } from 'interfaces/api/IUsers';
export type { ISearches } from 'interfaces/api/ISearches';
export type { IStreams, ITwitterStream } from 'interfaces/api/IStreams';

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

// Export types
export type { Post as Tweet, PostOptions as TweetOptions } from 'src/types/post';
export type { Media, MediaUploadOptions } from 'types/media';
export type { User, UserLookupOptions } from 'types/user';
export type { SearchOptions, SearchResponse } from 'types/search';
export type { StreamOptions } from 'types/stream';

// Export utilities
export { TwitterError, TwitterAPIError, RateLimitError, AuthenticationError } from 'utils/error';
export { parseRateLimitHeaders, isRateLimitExceeded, getTimeUntilReset } from 'utils/rate-limit';
export type { RateLimitInfo } from 'utils/rate-limit';
