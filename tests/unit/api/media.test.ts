import { Media } from '../../../src/api/media';
import { IOAuth2Config } from '../../../src/interfaces/auth/IOAuth2Auth';
import { IUploadMediaResponse } from '../../../src/types/x-api/media/upload_media_response';
import { IGetUploadStatusResponse } from '../../../src/types/x-api/media/get_upload_status_response';
import { IAddMetadataResponse } from '../../../src/types/x-api/media/add_metadata_response';
import { FetchAdapter } from '../../../src';
import { FakeRequestClient, FakeOAuth2Auth } from '../helpers';

describe('Media', () => {
  const baseUrl = 'https://api.x.com';
  const oAuth2Config: IOAuth2Config = {
    clientId: 'mock-client-id',
    clientSecret: 'mock-client-secret',
    scopes: [],
    redirectUri: 'http://localhost:3000/oauth2/callback'
  };
  const httpAdapter = new FetchAdapter();
  const requestClient = new FakeRequestClient(httpAdapter);
  const oAuth2 = new FakeOAuth2Auth(oAuth2Config, httpAdapter);
  const media = new Media(baseUrl, null, oAuth2, requestClient);
  const getMock = jest.spyOn(requestClient, 'get');
  const postMock = jest.spyOn(requestClient, 'post');
  const deleteMock = jest.spyOn(requestClient, 'delete');
  const getHeadersMock = jest.spyOn(oAuth2, 'getHeaders');

  beforeEach(() => {
    getMock.mockClear();
    postMock.mockClear();
    deleteMock.mockClear();
    getHeadersMock.mockClear();
  });

  describe('uploadMedia', () => {
    it('should upload media successfully', async () => {
      // Mock data
      const mediaBuffer = Buffer.from('test-image-data');
      const mimeType = 'image/jpeg';
      const category = 'tweet_image';
      
      // Mock responses for each step
      const initResponse: IUploadMediaResponse = {
        data: {
          id: 'media-123',
          media_key: 'media_key-123',
          expires_after_secs: 3600
        }
      };
      
      const finalizeResponse: IUploadMediaResponse = {
        data: {
          id: 'media-123',
          media_key: 'media_key-123',
          expires_after_secs: 3600
        }
      };
      
      // Setup mock implementations
      postMock
        .mockResolvedValueOnce(initResponse) // INIT
        .mockResolvedValueOnce(undefined)    // APPEND
        .mockResolvedValueOnce(finalizeResponse); // FINALIZE
      
      // Call the method
      const result = await media.upload(mediaBuffer, mimeType, category);
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(3); // Once for each step
      expect(postMock).toHaveBeenCalledTimes(3);
      
      // Verify INIT call
      expect(postMock).toHaveBeenNthCalledWith(
        1,
        `${baseUrl}/2/media/upload`,
        {
          command: 'INIT',
          total_bytes: mediaBuffer.length,
          media_type: mimeType,
          media_category: category
        },
        { Authorization: 'Bearer mock-token' },
        undefined,
        'multipart/form-data'
      );
      
      // Verify APPEND call
      expect(postMock).toHaveBeenNthCalledWith(
        2,
        `${baseUrl}/2/media/upload`,
        {
          command: 'APPEND',
          media_id: 'media-123',
          segment_index: 0,
          media: expect.any(Blob)
        },
        { Authorization: 'Bearer mock-token' },
        undefined,
        'multipart/form-data'
      );
      
      // Verify FINALIZE call
      expect(postMock).toHaveBeenNthCalledWith(
        3,
        `${baseUrl}/2/media/upload`,
        {
          command: 'FINALIZE',
          media_id: 'media-123'
        },
        { Authorization: 'Bearer mock-token' },
        undefined,
        'multipart/form-data'
      );
      
      expect(result).toEqual(finalizeResponse);
    });

    it('should handle media processing when required', async () => {
      // Mock data
      const mediaBuffer = Buffer.from('test-video-data');
      const mimeType = 'video/mp4';
      const category = 'tweet_video';
      
      // Mock responses for each step
      const initResponse: IUploadMediaResponse = {
        data: {
          id: 'media-123',
          media_key: 'media_key-123',
          expires_after_secs: 3600
        }
      };
      
      const finalizeResponse: IUploadMediaResponse = {
        data: {
          id: 'media-123',
          media_key: 'media_key-123',
          expires_after_secs: 3600,
          processing_info: {
            state: 'pending',
            check_after_secs: 1,
            progress_percent: 0
          }
        }
      };
      
      const processingResponse: IGetUploadStatusResponse = {
        data: {
          id: 'media-123',
          media_key: 'media_key-123',
          expires_after_secs: 3600,
          processing_info: {
            state: 'in_progress',
            check_after_secs: 1,
            progress_percent: 50
          }
        }
      };
      
      const completedResponse: IGetUploadStatusResponse = {
        data: {
          id: 'media-123',
          media_key: 'media_key-123',
          expires_after_secs: 3600,
          processing_info: {
            state: 'succeeded',
            check_after_secs: 0,
            progress_percent: 100
          }
        }
      };
      
      // Setup mock implementations
      postMock
        .mockResolvedValueOnce(initResponse)    // INIT
        .mockResolvedValueOnce(undefined)       // APPEND
        .mockResolvedValueOnce(finalizeResponse); // FINALIZE
      
      getMock
        .mockResolvedValueOnce(processingResponse)  // First status check
        .mockResolvedValueOnce(completedResponse);  // Second status check
      
      // Mock setTimeout to avoid waiting in tests
      jest.spyOn(global, 'setTimeout').mockImplementation((cb: any) => {
        cb();
        return {} as any;
      });
      
      // Call the method
      const result = await media.upload(mediaBuffer, mimeType, category);
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(5); // 3 for upload steps, 2 for status checks
      expect(postMock).toHaveBeenCalledTimes(3);
      expect(getMock).toHaveBeenCalledTimes(2);
      
      // Verify status check calls
      expect(getMock).toHaveBeenCalledWith(
        `${baseUrl}/2/media/upload`,
        { command: 'STATUS', media_id: 'media-123' },
        { Authorization: 'Bearer mock-token' }
      );
      
      expect(result).toEqual(completedResponse);
    });

    it('should handle errors during media upload', async () => {
      // Mock data
      const mediaBuffer = Buffer.from('test-image-data');
      const mimeType = 'image/jpeg';
      const category = 'tweet_image';
      const mockError = new Error('Upload failed');
      
      // Setup mock implementation to throw an error
      postMock.mockRejectedValueOnce(mockError);
      
      // Call the method and expect it to throw
      await expect(media.upload(mediaBuffer, mimeType, category))
        .rejects.toThrow('Upload failed');
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUploadStatus', () => {
    it('should get media upload status successfully', async () => {
      // Mock data
      const mediaId = 'media-123';
      const mockResponse: IGetUploadStatusResponse = {
        data: {
          id: mediaId,
          media_key: 'media_key-123',
          expires_after_secs: 3600,
          processing_info: {
            state: 'succeeded',
            check_after_secs: 0,
            progress_percent: 100
          }
        }
      };
      
      // Setup mock implementation
      getMock.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await media.getStatus(mediaId);
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith(
        `${baseUrl}/2/media/upload`,
        { command: 'STATUS', media_id: mediaId },
        { Authorization: 'Bearer mock-token' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when getting upload status', async () => {
      // Mock data
      const mediaId = 'media-123';
      const mockError = new Error('Status check failed');
      
      // Setup mock implementation to throw an error
      getMock.mockRejectedValueOnce(mockError);
      
      // Call the method and expect it to throw
      await expect(media.getStatus(mediaId))
        .rejects.toThrow('Status check failed');
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('addMetadata', () => {
    it('should add metadata to media successfully', async () => {
      // Mock data
      const mediaId = 'media-123';
      const altText = 'A beautiful sunset';
      const allowDownload = true;
      const mockResponse: IAddMetadataResponse = {
        data: {
          id: mediaId,
          associated_metadata: {
            alt_text: {
              text: altText
            },
            allow_download_status: {
              allow_download: allowDownload
            }
          }
        }
      };
      
      // Setup mock implementation
      postMock.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await media.addMetadata(mediaId, altText, allowDownload);
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith(
        `${baseUrl}/2/media/metadata`,
        {
          id: mediaId,
          metadata: {
            alt_text: {
              text: altText
            },
            allow_download_status: {
              allow_download: allowDownload
            }
          }
        },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should add all metadata options when provided', async () => {
      // Mock data
      const mediaId = 'media-123';
      const altText = 'A beautiful sunset';
      const allowDownload = true;
      const originalId = 'original-123';
      const originalProvider = 'giphy';
      const uploadSource = 'gallery';
      const mockResponse: IAddMetadataResponse = {
        data: {
          id: mediaId,
          associated_metadata: {
            alt_text: {
              text: altText
            },
            allow_download_status: {
              allow_download: allowDownload
            },
            found_media_origin: {
              id: originalId,
              provider: originalProvider
            },
            upload_source: {
              upload_source: uploadSource
            }
          }
        }
      };
      
      // Setup mock implementation
      postMock.mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await media.addMetadata(
        mediaId, 
        altText, 
        allowDownload, 
        originalId, 
        originalProvider, 
        uploadSource
      );
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledWith(
        `${baseUrl}/2/media/metadata`,
        {
          id: mediaId,
          metadata: {
            alt_text: {
              text: altText
            },
            allow_download_status: {
              allow_download: allowDownload
            },
            found_media_origin: {
              id: originalId,
              provider: originalProvider
            },
            upload_source: {
              upload_source: uploadSource
            }
          }
        },
        {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json'
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle errors when adding metadata', async () => {
      // Mock data
      const mediaId = 'media-123';
      const altText = 'A beautiful sunset';
      const allowDownload = true;
      const mockError = new Error('Metadata update failed');
      
      // Setup mock implementation to throw an error
      postMock.mockRejectedValueOnce(mockError);
      
      // Call the method and expect it to throw
      await expect(media.addMetadata(mediaId, altText, allowDownload))
        .rejects.toThrow('Metadata update failed');
      
      // Assertions
      expect(getHeadersMock).toHaveBeenCalledTimes(1);
      expect(postMock).toHaveBeenCalledTimes(1);
    });
  });
});
