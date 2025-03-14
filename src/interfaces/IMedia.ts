import { Media, MediaUploadOptions } from '../types/media';

/**
 * Interface for the Media module.
 * Provides methods for interacting with media on Twitter.
 */
export interface IMedia {
  /**
   * Uploads media to Twitter.
   * 
   * @param media - The media buffer to upload
   * @param options - Optional parameters for the media upload
   * @returns A promise that resolves to the uploaded media
   */
  uploadMedia(media: Buffer, options?: MediaUploadOptions): Promise<Media>;

  /**
   * Adds metadata to an uploaded media.
   * 
   * @param mediaId - The ID of the media to add metadata to
   * @param altText - The alt text to add to the media
   * @returns A promise that resolves when the metadata is added
   */
  addMetadata(mediaId: string, altText: string): Promise<void>;

  /**
   * Retrieves information about a media.
   * 
   * @param mediaId - The ID of the media to retrieve
   * @returns A promise that resolves to the media information
   */
  getMedia(mediaId: string): Promise<Media>;
}
