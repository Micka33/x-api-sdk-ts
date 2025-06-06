import { IXError } from "src/types/x-api/error_responses";
import { AbstractMedia } from "../interfaces/api/IMedia";
import type { IAddMetadataResponse } from "../types/x-api/media/add_metadata_response";
import type { IGetUploadStatusResponse } from "../types/x-api/media/get_upload_status_response";
import type { IAppendParams, IInitParams, MediaCategory } from "../types/x-api/media/upload_media_query";
import type { IUploadMediaResponse } from "../types/x-api/media/upload_media_response";
import { RCResponse, RCResponseSimple } from "src/interfaces/IRequestClient";

export class Media extends AbstractMedia {
  /**
   * Uploads media to Twitter.
   * If a processing_info field is NOT returned in the response, then media_id is ready for use in other API endpoints.
   * https://docs.x.com/x-api/media/quickstart/media-upload-chunked#step-2-%3A-post-media%2Fupload-append
   *
   * @param media - The media buffer to upload
   * @param mimeType - The MIME type of the media being uploaded. For example, video/mp4.
   * @param category - A string enum value which identifies a media use-case.
   * @param additionalOwners - A comma-separated list of user IDs to set as additional owners allowed to use the returned media_id in Tweets or Cards. Up to 100 additional owners may be specified.
   * @param chunkSize - The size of the chunks to upload. If not provided, the default chunk size will be used (default: MIN(4MB, MAX(1MB, media.length / 10))).
   * @returns A promise that resolves to the uploaded media
   */
  public async upload(
    media: Buffer, 
    mimeType: string, 
    category: 'amplify_video' | 'tweet_gif' | 'tweet_image' | 'tweet_video' | 'dm_video' | 'subtitles', 
    additionalOwners: string[] | null = null,
    chunkSize?: number | null,
    minWaitingTimeInSeconds?: number
  ): Promise<RCResponse<IUploadMediaResponse>> {
    // Step 1: INIT - Initialize the upload
    const initResponse = await this.initMediaUpload(media.length, mimeType, category, additionalOwners);
    if (!this.requestClient.isSuccessResponse(initResponse)) {
      return initResponse as RCResponseSimple<IXError | string | null | undefined>;
    }
    const mediaId = initResponse.data.data.id;

    // Step 2: APPEND - Upload the media in chunks
    // 4MB is the maximum chunk size allowed by the API (at least for free api access)
    const minChunkSize = 1024 * 1024; // 1MB
    const maxChunkSize = 1024 * 1024 * 4; // 4MB
    const tenthOfMediaLength = Math.ceil(media.length / 10); // 10 chunks
    const defaultChunkSize = Math.min(maxChunkSize, Math.max(minChunkSize, tenthOfMediaLength));
    const cs = chunkSize || defaultChunkSize;
    const chunks = Math.ceil(media.length / cs);

    for (let i = 0; i < chunks; i++) {
      const start = i * cs;
      const end = Math.min(start + cs, media.length);
      const chunk = media.subarray(start, end);
      const appendResponse = await this.appendMediaChunk(mediaId, i, chunk);
      if (!appendResponse.ok) {
        return appendResponse as RCResponseSimple<IXError | string | null | undefined>;
      }
    }

    // Step 3: FINALIZE - Complete the upload
    const finalizeResponse = await this.finalizeMediaUpload(mediaId);
    if (!this.requestClient.isSuccessResponse(finalizeResponse)) {
      return finalizeResponse as RCResponseSimple<IXError | string | null | undefined>;
    }
    // Step 4: Check if processing is needed
    if (finalizeResponse.data.data.processing_info) {
      // If processing is needed, wait for it to complete
      const waitingResponse = await this.waitForProcessing(mediaId, finalizeResponse, minWaitingTimeInSeconds);
      return waitingResponse;
    }
    return finalizeResponse;
  }

  /**
   * Get MediaUpload Status.
   *
   * @param mediaId - Media id for the requested media upload status.
   * @returns A promise that resolves to the uploaded media
   */
  public async getStatus(mediaId: string) {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    // Make the API request
    return this.requestClient.get<IGetUploadStatusResponse>(
      `${this.baseUrl}/2/media/upload`,
      { command: 'STATUS', media_id: mediaId },
      headers
    );
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
  ) {
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
    return this.requestClient.post<IAddMetadataResponse>(
      `${this.baseUrl}/2/media/metadata`,
      requestBody,
      {
        ...headers,
        'Content-Type': 'application/json'
      }
    );
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
    mediaCategory: MediaCategory, 
    additionalOwners: string[] | null = null
  ) {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();

    // Create form data
    const formData: IInitParams = {
      command: 'INIT',
      total_bytes: totalBytes,
      media_type: mediaType
    };

    if (mediaCategory) {
      formData.media_category = mediaCategory;
    }

    if (additionalOwners && additionalOwners.length > 0) {
      formData.additional_owners = additionalOwners;
    }

    // Make the API request
    return this.requestClient.post<IUploadMediaResponse>(
      `${this.baseUrl}/2/media/upload`,
      formData,
      headers,
      undefined,
      'multipart/form-data'
    );
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
  private async appendMediaChunk(
    mediaId: string,
    segmentIndex: number,
    chunk: Buffer
  ) {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Create form data
    const params: IAppendParams = {
      command: 'APPEND',
      media_id: mediaId,
      segment_index: segmentIndex,
      media: new Blob([chunk])
    };
    
    // Make the API request
    return await this.requestClient.post<IUploadMediaResponse>(
      `${this.baseUrl}/2/media/upload`,
      params,
      headers,
      undefined,
      'multipart/form-data'
    );
  }

  /**
   * Finalizes a media upload.
   * 
   * @param mediaId - The media ID from the INIT command
   * @returns A promise that resolves to the finalization response
   * @private
   */
  private async finalizeMediaUpload(mediaId: string) {
    // Get authentication headers using OAuth 2.0
    const headers = await this.oAuth2.getHeaders();
    
    // Create form data
    const formData: Record<string, any> = {
      command: 'FINALIZE',
      media_id: mediaId
    };
    
    // Make the API request
    return this.requestClient.post<IUploadMediaResponse>(
      `${this.baseUrl}/2/media/upload`,
      formData,
      headers,
      undefined,
      'multipart/form-data'
    );
  }

  /**
   * Waits for media processing to complete by polling the status endpoint.
   * 
   * @param mediaId - The media ID to check
   * @param initialResponse - The initial response from the FINALIZE command
   * @returns A promise that resolves to the final media status
   * @private
   */
  private async waitForProcessing(
    mediaId: string,
    initialResponse: RCResponseSimple<IUploadMediaResponse>,
    minWaitingTimeInSeconds?: number
  ): Promise<RCResponse<IUploadMediaResponse>> {
    let response: RCResponseSimple<IUploadMediaResponse> = initialResponse;
    let data = response.data.data;

    // Keep checking until processing is complete or fails
    while (
      response && data && typeof data !== 'string' &&
      data.processing_info && 
      ['pending', 'in_progress'].includes(data.processing_info.state)
    ) {
      // Wait for the recommended time before checking again
      const checkAfterSecs = Math.min(minWaitingTimeInSeconds || 0, data.processing_info?.check_after_secs || 1);
      await new Promise(resolve => setTimeout(resolve, checkAfterSecs * 1000));

      // Check status
      const rcResponse = await this.getStatus(mediaId);

      if (!this.requestClient.isSuccessResponse(rcResponse)) {
        console.error('Error waiting for media processing to complete (status)', JSON.stringify(rcResponse, null, 2));
        return rcResponse as RCResponseSimple<IXError | string | null | undefined>;
      }
      response = rcResponse;
      data = response.data.data;
    }
    return response;
  }
}