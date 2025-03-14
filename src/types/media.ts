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
