import { EventEmitter } from 'events';
import { StreamOptions } from 'types/stream';

/**
 * Interface for a Twitter stream.
 * Extends EventEmitter to provide event-based access to streaming data.
 */
export interface ITwitterStream extends EventEmitter {
  /**
   * Starts the stream.
   *
   * @returns A promise that resolves when the stream is started
   */
  start(): Promise<void>;

  /**
   * Stops the stream.
   *
   * @returns A promise that resolves when the stream is stopped
   */
  stop(): Promise<void>;

  /**
   * Pauses the stream.
   *
   * @returns A promise that resolves when the stream is paused
   */
  pause(): Promise<void>;

  /**
   * Resumes the stream.
   *
   * @returns A promise that resolves when the stream is resumed
   */
  resume(): Promise<void>;
}

/**
 * Interface for the Streams module.
 * Provides methods for creating and managing Twitter streams.
 */
export interface IStreams {
  /**
   * Creates a filtered stream based on keywords, users, or locations.
   *
   * @param options - Options for the filtered stream
   * @returns A Twitter stream instance
   */
  createFilteredStream(options: StreamOptions): ITwitterStream;

  /**
   * Creates a sample stream of public tweets.
   *
   * @param options - Options for the sample stream
   * @returns A Twitter stream instance
   */
  createSampleStream(options?: StreamOptions): ITwitterStream;

  /**
   * Creates a stream of tweets from specific users.
   *
   * @param userIds - The IDs of the users to stream tweets from
   * @param options - Options for the user stream
   * @returns A Twitter stream instance
   */
  createUserStream(userIds: string[], options?: StreamOptions): ITwitterStream;

  /**
   * Creates a rules-based filtered stream (v2 API).
   *
   * @param rules - The rules to filter tweets by
   * @param options - Options for the rules-based stream
   * @returns A Twitter stream instance
   */
  createRulesStream(rules: Array<{ value: string; tag?: string }>, options?: StreamOptions): ITwitterStream;
}
