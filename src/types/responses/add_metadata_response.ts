import { ResponseType } from "./response_type";

/**
 * Represents the data object for a media item.
 */
interface MediaData {
  /**
   * Metadata associated with the media.
   */
  associated_metadata: AssociatedMetadata;
  /**
   * The unique identifier of this Media.
   * @example "1146654567674912769"
   */
  id: string;
}

/**
 * Metadata associated with the media.
 */
interface AssociatedMetadata {
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
   * @example "A dancing cat"
   * @constraint <= 1000 characters
   */
  text: string;
}

/**
 * Origin information if the media was found from a provider.
 */
interface FoundMediaOrigin {
  /**
   * Unique Identifier of the media within the provider.
   * @example "u5BzatR15TZ04"
   * @constraint <= 24 characters
   */
  id: string;
  /**
   * The media provider that sourced the media (e.g., 'giphy').
   * @example "giphy"
   * @constraint <= 8 characters
   */
  provider: string;
}

/**
 * Information about stickers applied to the media.
 */
interface StickerInfo {
  /**
   * List of stickers applied to the media.
   * @constraint Must not be empty and should not exceed 25 items
   */
  stickers: object[];
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

export interface AddMetadataResponse extends ResponseType<MediaData>{};
