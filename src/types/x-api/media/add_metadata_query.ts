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
   * Metadata associated with the media.
   */
  metadata?: IMediaMetadata;
}

/**
 * Represents the metadata for a media item.
 */
interface IMediaMetadata {
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
  stickers: ISticker[];
}

/**
 * Represents a sticker applied to the media.
 */
interface ISticker {
  /**
   * Width-to-height ratio of the media.
   * @example 1.78
   */
  aspect_ratio?: number;
  /**
   * A unique identifier for the group of annotations associated with the media.
   * @example 987654321098765
   */
  group_annotation_id?: number;
  /**
   * Unique identifier for the sticker.
   * @example "12345"
   */
  id?: string;
  /**
   * A unique identifier for the sticker set associated with the media.
   * @example 123456789012345
   */
  sticker_set_annotation_id?: number;
  /**
   * Scale or rotate the media on the x-axis.
   * @example 1
   */
  transform_a?: number;
  /**
   * Skew the media on the x-axis.
   * @example 0
   */
  transform_b?: number;
  /**
   * Skew the media on the y-axis.
   * @example 0
   */
  transform_c?: number;
  /**
   * Scale or rotate the media on the y-axis.
   * @example 1
   */
  transform_d?: number;
  /**
   * Scale or rotate the media on the x-axis.
   * @example 10.5
   */
  transform_tx?: number;
  /**
   * The vertical translation (shift) value for the media.
   * @example -5.2
   */
  transform_ty?: number;
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

export interface IAddMetadataQuery extends IMediaData {}
