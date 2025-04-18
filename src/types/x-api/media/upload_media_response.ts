import { IBaseResponse } from "../base_response";
/**
 * Represents the possible states of a media upload.
 */
type UploadState = 'succeeded' | 'in_progress' | 'pending' | 'failed';

/**
 * Information about the processing status of the media.
 */
interface IProcessingInfo {
  /**
   * Number of seconds to wait before checking the status again.
   */
  check_after_secs: number;
  /**
   * Percentage of the upload progress.
   */
  progress_percent: number;
  /**
   * State of the upload.
   * Available options: 'succeeded', 'in_progress', 'pending', 'failed'
   */
  state: UploadState;
}

/**
 * Represents the data object for a media item.
 */
interface IMediaData {
  /**
   * The unique identifier of this Media.
   * @example "1146654567674912769"
   */
  id: string;
  /**
   * The Media Key identifier for this attachment.
   */
  media_key: string;
  /**
   * Number of seconds after which the upload session expires.
   */
  expires_after_secs?: number;
  /**
   * Information about the processing status of the media.
   */
  processing_info?: IProcessingInfo;
  /**
   * Size of the upload.
   */
  size?: number;
}

export interface IUploadMediaResponse extends IBaseResponse<IMediaData> {}
