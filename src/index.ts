// Export the client
export { TwitterClient } from './client';
export type { TwitterClientConfig } from './client';

// Export interfaces
export type { ITwitterClient, RequestOptions } from './interfaces/ITwitterClient';
export type { IAuth } from './interfaces/IAuth';
export type { ITweets } from './interfaces/ITweets';
export type { IMedia } from './interfaces/IMedia';
export type { IUsers } from './interfaces/IUsers';
export type { ISearches } from './interfaces/ISearches';
export type { IStreams, ITwitterStream } from './interfaces/IStreams';

// Export authentication
export { OAuth1Auth } from './auth/OAuth1Auth';
export type { OAuth1Config } from './auth/OAuth1Auth';
export { OAuth2Auth } from './auth/OAuth2Auth';
export type { OAuth2Config } from './auth/OAuth2Auth';

// Export types
export type { Tweet, TweetOptions } from './types/tweet';
export type { Media, MediaUploadOptions } from './types/media';
export type { User, UserLookupOptions } from './types/user';
export type { SearchOptions, SearchResponse } from './types/search';
export type { StreamOptions } from './types/stream';

// Export utilities
export { TwitterError, TwitterAPIError, RateLimitError, AuthenticationError } from './utils/error';
export { parseRateLimitHeaders, isRateLimitExceeded, getTimeUntilReset } from './utils/rate-limit';
export type { RateLimitInfo } from './utils/rate-limit';
