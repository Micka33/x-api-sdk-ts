import { IBaseResponse, IErrorResponse } from '../base_response';

/**
 * Represents the data object for a media item.
 */
interface IMediaData {
  /**
   * Metadata associated with the media.
   */
  associated_metadata: IAssociatedMetadata;
  /**
   * The unique identifier of this Media.
   * @example "1146654567674912769"
   */
  id: string;
}

/**
 * Metadata associated with the media.
 */
interface IAssociatedMetadata {
  /**
   * Status indicating whether the media can be downloaded.
   */
  allow_download_status?: IAllowDownloadStatus;
  /**
   * Alternative text description for the media.
   */
  alt_text?: IAltText;
  /**
   * Origin information if the media was found from a provider.
   */
  found_media_origin?: IFoundMediaOrigin;
  /**
   * Information about stickers applied to the media.
   */
  sticker_info?: IStickerInfo;
  /**
   * Source from which the media was uploaded.
   */
  upload_source?: IUploadSource;
}

/**
 * Status indicating whether the media can be downloaded.
 */
interface IAllowDownloadStatus {
  /**
   * Whether downloading is allowed.
   * @example true
   */
  allow_download: boolean;
}

/**
 * Alternative text description for the media.
 */
interface IAltText {
  /**
   * Description of the media.
   * constraint: <= 1000 characters
   * @example "A dancing cat"
   */
  text: string;
}

/**
 * Origin information if the media was found from a provider.
 */
interface IFoundMediaOrigin {
  /**
   * Unique Identifier of the media within the provider.
   * constraint: <= 24 characters
   * @example "u5BzatR15TZ04"
   */
  id: string;
  /**
   * The media provider that sourced the media (e.g., 'giphy').
   * constraint: <= 8 characters
   * @example "giphy"
   */
  provider: string;
}

/**
 * Information about stickers applied to the media.
 */
interface IStickerInfo {
  /**
   * List of stickers applied to the media.
   * constraint: Must not be empty and should not exceed 25 items
   */
  stickers: object[];
}

/**
 * Source from which the media was uploaded.
 */
interface IUploadSource {
  /**
   * The source (e.g., app, device) from which the media was uploaded.
   * @example "gallery"
   */
  upload_source: string;
}

export interface ISuccessAddMetadataResponse extends IBaseResponse<IMediaData>{};
export type IAddMetadataResponse = ISuccessAddMetadataResponse | IErrorResponse;
