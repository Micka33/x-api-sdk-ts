import { IAddMetadataResponse } from 'src/types/x-api/media/add_metadata_response';
import { IGetUploadStatusResponse } from 'src/types/x-api/media/get_upload_status_response';
import { IUploadMediaResponse } from 'src/types/x-api/media/upload_media_response';

/**
 * Interface for the Media module.
 * Provides methods for interacting with media on Twitter.
 */
export interface IMedia {
  /**
   * Uploads media to Twitter.
   *
   * @param media - The media buffer to upload
   * @param mimeType - The MIME type of the media being uploaded. For example, video/mp4.
   * @param category - A string enum value which identifies a media use-case.
   * @param additionalOwners - A comma-separated list of user IDs to set as additional owners allowed to use the returned media_id in Tweets or Cards. Up to 100 additional owners may be specified.
   * @returns A promise that resolves to the uploaded media
   */
  uploadMedia(media: Buffer, mimeType: string, category: 'amplify_video' | 'tweet_gif' | 'tweet_image' | 'tweet_video' | 'dm_video' | 'subtitles', additionalOwners?: string[]): Promise<IUploadMediaResponse>;

  /**
   * Get MediaUpload Status.
   *
   * @param mediaId - Media id for the requested media upload status.
   * @param command - The command for the media upload request.
   * @returns A promise that resolves to the uploaded media
   */
  getUploadStatus(mediaId: string, command: 'STATUS'): Promise<IGetUploadStatusResponse>;

  /**
   * Adds metadata to an uploaded media.
   *
   * @param mediaId - The ID of the media to add metadata to
   * @param altText - The alt text to add to the media
   * @param allowDownload - Whether to allow downloads of the media
   * @param originalId - The original ID of the media
   * @param originalProvider - The original provider of the media
   * @param uploadSource - The source of the media upload
   * @returns A promise that resolves when the metadata is added
   */
  addMetadata(mediaId: string, altText: string, allowDownload: boolean, originalId?: string, originalProvider?: string, uploadSource?: string): Promise<IAddMetadataResponse>;
}
