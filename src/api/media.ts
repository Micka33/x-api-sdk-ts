import { IMedia } from "interfaces/api/IMedia";
import { IOAuth1Auth } from "interfaces/auth/IOAuth1Auth";
import { IOAuth2Auth } from "interfaces/auth/IOAuth2Auth";
import { AddMetadataResponse } from "src/types/responses/add_metadata_response";
import { GetUploadStatusResponse } from "src/types/responses/get_upload_status_response";
import { UploadMediaResponse } from "src/types/responses/upload_media_response";

export class Media implements IMedia {
  constructor(private readonly baseUrl: string, private readonly oAuth1: IOAuth1Auth, private readonly oAuth2: IOAuth2Auth) {}

  /**
   * Uploads media to Twitter.
   *
   * @param media - The media buffer to upload
   * @param mimeType - The MIME type of the media being uploaded. For example, video/mp4.
   * @param category - A string enum value which identifies a media use-case.
   * @param additionalOwners - A comma-separated list of user IDs to set as additional owners allowed to use the returned media_id in Tweets or Cards. Up to 100 additional owners may be specified.
   * @returns A promise that resolves to the uploaded media
   */
  public async uploadMedia(
    media: Buffer, 
    mimeType: string, 
    category: 'amplify_video' | 'tweet_gif' | 'tweet_image' | 'tweet_video' | 'dm_video' | 'subtitles', 
    additionalOwners?: string[]
  ): Promise<UploadMediaResponse> {
    // Step 1: INIT - Initialize the upload
    const initResponse = await this.initMediaUpload(media.length, mimeType, category, additionalOwners);
    const mediaId = initResponse.data.id;

    // Step 2: APPEND - Upload the media in chunks
    const chunkSize = 1024 * 1024; // 1MB chunks
    const chunks = Math.ceil(media.length / chunkSize);
    
    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, media.length);
      const chunk = media.slice(start, end);
      
      await this.appendMediaChunk(mediaId, i, chunk);
    }

    // Step 3: FINALIZE - Complete the upload
    const finalizeResponse = await this.finalizeMediaUpload(mediaId);
    
    // Step 4: Check if processing is needed
    if (finalizeResponse.data.processing_info) {
      // If processing is needed, wait for it to complete
      return this.waitForProcessing(mediaId, finalizeResponse);
    }
    
    return finalizeResponse;
  }

  /**
   * Get MediaUpload Status.
   *
   * @param mediaId - Media id for the requested media upload status.
   * @param command - The command for the media upload request.
   * @returns A promise that resolves to the uploaded media
   */
  public async getUploadStatus(mediaId: string, command: 'STATUS'): Promise<GetUploadStatusResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Make the API request
    const url = new URL(`${this.baseUrl}/2/media/upload`);
    url.searchParams.append('command', command);
    url.searchParams.append('media_id', mediaId);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
    });
    
    // Parse the response
    const data: GetUploadStatusResponse = await response.json();
    
    return data;
  }

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
   * 
   * @example
   * ```typescript
   * const result = await media.addMetadata(
   *   "1146654567674912769",
   *   "A beautiful sunset over the ocean",
   *   true,
   *   "u5BzatR15TZ04",
   *   "giphy",
   *   "gallery"
   * );
   * ```
   */
  public async addMetadata(
    mediaId: string, 
    altText: string, 
    allowDownload: boolean, 
    originalId?: string, 
    originalProvider?: string, 
    uploadSource?: string
  ): Promise<AddMetadataResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Build the request body
    const requestBody: Record<string, any> = {
      id: mediaId,
      metadata: {}
    };
    
    // Add alt text if provided
    if (altText) {
      requestBody.metadata.alt_text = {
        text: altText
      };
    }
    
    // Add allow download status
    requestBody.metadata.allow_download_status = {
      allow_download: allowDownload
    };
    
    // Add found media origin if both ID and provider are provided
    if (originalId && originalProvider) {
      requestBody.metadata.found_media_origin = {
        id: originalId,
        provider: originalProvider
      };
    }
    
    // Add upload source if provided
    if (uploadSource) {
      requestBody.metadata.upload_source = {
        upload_source: uploadSource
      };
    }
    
    // Make the API request
    const response = await fetch(`${this.baseUrl}/2/media/metadata`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    
    // Parse the response
    const data: AddMetadataResponse = await response.json();
    
    return data;
  }

  /**
   * Initializes a media upload session.
   * 
   * @param totalBytes - The total size of the media in bytes
   * @param mediaType - The MIME type of the media
   * @param mediaCategory - The category of the media
   * @param additionalOwners - Optional list of additional user IDs who can use this media
   * @returns A promise that resolves to the initialization response
   * @private
   */
  private async initMediaUpload(
    totalBytes: number, 
    mediaType: string, 
    mediaCategory: string, 
    additionalOwners?: string[]
  ): Promise<UploadMediaResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Create form data
    const formData = new FormData();
    formData.append('command', 'INIT');
    formData.append('total_bytes', totalBytes.toString());
    formData.append('media_type', mediaType);
    
    if (mediaCategory) {
      formData.append('media_category', mediaCategory);
    }
    
    if (additionalOwners && additionalOwners.length > 0) {
      formData.append('additional_owners', additionalOwners.join(','));
    }
    
    // Make the API request
    const response = await fetch(`${this.baseUrl}/2/media/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    // Parse the response
    const data: UploadMediaResponse = await response.json();
    
    return data;
  }

  /**
   * Uploads a chunk of media data.
   * 
   * @param mediaId - The media ID from the INIT command
   * @param segmentIndex - The index of the chunk (0-based)
   * @param chunk - The chunk of media data to upload
   * @returns A promise that resolves when the chunk is uploaded
   * @private
   */
  private async appendMediaChunk(mediaId: string, segmentIndex: number, chunk: Buffer): Promise<void> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Create form data
    const formData = new FormData();
    formData.append('command', 'APPEND');
    formData.append('media_id', mediaId);
    formData.append('segment_index', segmentIndex.toString());
    
    // Convert Buffer to Blob for FormData
    const blob = new Blob([chunk]);
    formData.append('media', blob);
    
    // Make the API request
    const response = await fetch(`${this.baseUrl}/2/media/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
  }

  /**
   * Finalizes a media upload.
   * 
   * @param mediaId - The media ID from the INIT command
   * @returns A promise that resolves to the finalization response
   * @private
   */
  private async finalizeMediaUpload(mediaId: string): Promise<UploadMediaResponse> {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Create form data
    const formData = new FormData();
    formData.append('command', 'FINALIZE');
    formData.append('media_id', mediaId);
    
    // Make the API request
    const response = await fetch(`${this.baseUrl}/2/media/upload`, {
      method: 'POST',
      headers,
      body: formData
    });

    // Parse the response
    const data: UploadMediaResponse = await response.json();
    
    return data;
  }

  /**
   * Waits for media processing to complete by polling the status endpoint.
   * 
   * @param mediaId - The media ID to check
   * @param initialResponse - The initial response from the FINALIZE command
   * @returns A promise that resolves to the final media status
   * @private
   */
  private async waitForProcessing(mediaId: string, initialResponse: UploadMediaResponse): Promise<UploadMediaResponse> {
    let response = initialResponse;
    
    // Keep checking until processing is complete or fails
    while (
      response.data.processing_info && 
      ['pending', 'in_progress'].includes(response.data.processing_info.state)
    ) {
      // Wait for the recommended time before checking again
      const checkAfterSecs = response.data.processing_info.check_after_secs || 1;
      await new Promise(resolve => setTimeout(resolve, checkAfterSecs * 1000));
      
      // Check status
      response = await this.getUploadStatus(mediaId, 'STATUS');      
    }
    
    return response;
  }
}