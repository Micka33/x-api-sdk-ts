/**
 * Represents a media item on Twitter.
 */
export interface Media {
  /** The unique identifier of the media */
  media_id: string;
  
  /** The media ID as a string */
  media_id_string: string;
  
  /** The size of the media in bytes */
  size: number;
  
  /** The expiration time of the media in seconds */
  expires_after_secs: number;
  
  /** The type of the media */
  type: 'photo' | 'video' | 'animated_gif';
  
  /** The width of the media */
  width?: number;
  
  /** The height of the media */
  height?: number;
  
  /** The URL of the media */
  url?: string;
  
  /** The processing information for the media */
  processing_info?: {
    state: 'pending' | 'in_progress' | 'failed' | 'succeeded';
    check_after_secs?: number;
    progress_percent?: number;
    error?: {
      code: number;
      name: string;
      message: string;
    };
  };
}

/**
 * Options for uploading media to Twitter.
 */
export interface MediaUploadOptions {
  /** The MIME type of the media */
  mimeType: string;
  
  /** The alt text for the media (for accessibility) */
  altText?: string;
  
  /** Whether the media is being shared (for copyright purposes) */
  shared?: boolean;
  
  /** The category of the media */
  category?: 'tweet_image' | 'tweet_video' | 'tweet_gif' | 'amplify_video';
  
  /** Additional media data */
  additionalOwners?: string[];
}
