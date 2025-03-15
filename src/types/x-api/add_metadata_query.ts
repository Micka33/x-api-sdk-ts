/**
 * Represents the data object for a media item.
 */
interface MediaData {
  /**
   * The unique identifier of this Media.
   * @example "1146654567674912769"
   */
  id: string;
  /**
   * Metadata associated with the media.
   */
  metadata?: MediaMetadata;
}

/**
 * Represents the metadata for a media item.
 */
interface MediaMetadata {
  /**
   * Status indicating whether the media can be downloaded.
   */
  allow_download_status?: AllowDownloadStatus;
  /**
   * Alternative text description for the media.
   */
  alt_text?: AltText;
  /**
   * Origin information if the media was found from a provider.
   */
  found_media_origin?: FoundMediaOrigin;
  /**
   * Information about stickers applied to the media.
   */
  sticker_info?: StickerInfo;
  /**
   * Source from which the media was uploaded.
   */
  upload_source?: UploadSource;
}

/**
 * Status indicating whether the media can be downloaded.
 */
interface AllowDownloadStatus {
  /**
   * Whether downloading is allowed.
   * @example true
   */
  allow_download: boolean;
}

/**
 * Alternative text description for the media.
 */
interface AltText {
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
interface FoundMediaOrigin {
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
interface StickerInfo {
  /**
   * List of stickers applied to the media.
   * constraint: Must not be empty and should not exceed 25 items
   */
  stickers: Sticker[];
}

/**
 * Represents a sticker applied to the media.
 */
interface Sticker {
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
interface UploadSource {
  /**
   * The source (e.g., app, device) from which the media was uploaded.
   * @example "gallery"
   */
  upload_source: string;
}

export interface AddMetadataQuery extends MediaData {}
