/**
 * A string enum value which identifies a media use-case.
 * This identifier is used to enforce use-case specific constraints (e.g., file size, video duration)
 * and enable advanced features.
 */
export type MediaCategory = 'amplify_video' | 'tweet_gif' | 'tweet_image' | 'tweet_video' | 'dm_video' | 'subtitles';

/**
 * The type of command to use for media upload.
 */
export type Command = 'INIT' | 'APPEND' | 'FINALIZE';

/**
 * Parameters for the INIT command to initialize a media upload.
 */
export interface InitParams {
  /**
   * The type of command, must be 'INIT'.
   * @example "INIT"
   */
  command: 'INIT';
  /**
   * Total number of bytes being uploaded.
   */
  total_bytes: number;
  /**
   * The MIME type of the media being uploaded.
   * @example "video/mp4"
   */
  media_type: string;
  /**
   * A string enum value which identifies a media use-case.
   * @example "tweet_video"
   */
  media_category?: MediaCategory;
  /**
   * A list of user IDs to set as additional owners allowed to use the returned media_id in Tweets or Cards.
   * Up to 100 additional owners may be specified. This is converted to a comma-separated string in the query.
   */
  additional_owners?: string[];
}

/**
 * Parameters for the APPEND command to upload media chunks.
 */
export interface AppendParams {
  /**
   * The type of command, must be 'APPEND'.
   * @example "APPEND"
   */
  command: 'APPEND';
  /**
   * The media ID of the targeted media to APPEND.
   * @example "1146654567674912769"
   */
  media_id: string;
  /**
   * The index of the chunk to APPEND.
   * @example 0
   */
  segment_index: number;
  /**
   * The media to APPEND.
   */
  media: Blob;
}

/**
 * Parameters for the FINALIZE command to complete the media upload.
 */
export interface FinalizeParams {
  /**
   * The type of command, must be 'FINALIZE'.
   * @example "FINALIZE"
   */
  command: 'FINALIZE';
  /**
   * The media ID of the targeted media to FINALIZE.
   * @example "1146654567674912769"
   */
  media_id: string;
}

/**
 * Union type for media upload query parameters, discriminated by the 'command' property.
 * Use this type to ensure the correct parameters are provided based on the command.
 */
export type UploadMediaQuery = InitParams | AppendParams | FinalizeParams;
