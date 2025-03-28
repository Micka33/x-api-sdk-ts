import { Media } from '../../../src/api/media';
import { IOAuth1Auth } from '../../../src/interfaces/auth/IOAuth1Auth';
import { IOAuth2Auth } from '../../../src/interfaces/auth/IOAuth2Auth';
import { IRequestClient } from '../../../src/interfaces/IRequestClient';
import { IUploadMediaResponse } from '../../../src/types/x-api/media/upload_media_response';
import { IGetUploadStatusResponse } from '../../../src/types/x-api/media/get_upload_status_response';
import { IAddMetadataResponse } from '../../../src/types/x-api/media/add_metadata_response';

describe('Media', () => {
  let media: Media;
  let mockOAuth1: IOAuth1Auth;
  let mockOAuth2: IOAuth2Auth;
  let mockRequestClient: IRequestClient;
  const baseUrl = 'https://api.twitter.com';

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Create mock auth providers
    mockOAuth1 = {
      getAsAuthorizationHeader: jest.fn(),
      getAuthorizationHeaders: jest.fn(),
      setToken: jest.fn().mockReturnThis(),
    };

    mockOAuth2 = {
      generateAuthorizeUrl: jest.fn(),
      exchangeAuthCodeForToken: jest.fn(),
      refreshAccessToken: jest.fn(),
      getToken: jest.fn(),
      setToken: jest.fn(),
      isTokenExpired: jest.fn(),
      getHeaders: jest.fn().mockResolvedValue({
        Authorization: 'Bearer mock-token',
      }),
    };

    // Create mock request client
    mockRequestClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
    };

    // Create media instance with mocks
    media = new Media(baseUrl, mockOAuth1, mockOAuth2, mockRequestClient);
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
      (mockRequestClient.post as jest.Mock)
        .mockResolvedValueOnce(initResponse) // INIT
        .mockResolvedValueOnce(undefined)    // APPEND
        .mockResolvedValueOnce(finalizeResponse); // FINALIZE
      
      // Call the method
      const result = await media.upload(mediaBuffer, mimeType, category);
      
      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(3); // Once for each step
      expect(mockRequestClient.post).toHaveBeenCalledTimes(3);
      
      // Verify INIT call
      expect(mockRequestClient.post).toHaveBeenNthCalledWith(
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
      expect(mockRequestClient.post).toHaveBeenNthCalledWith(
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
      expect(mockRequestClient.post).toHaveBeenNthCalledWith(
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
      (mockRequestClient.post as jest.Mock)
        .mockResolvedValueOnce(initResponse)    // INIT
        .mockResolvedValueOnce(undefined)       // APPEND
        .mockResolvedValueOnce(finalizeResponse); // FINALIZE
      
      (mockRequestClient.get as jest.Mock)
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
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(5); // 3 for upload steps, 2 for status checks
      expect(mockRequestClient.post).toHaveBeenCalledTimes(3);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(2);
      
      // Verify status check calls
      expect(mockRequestClient.get).toHaveBeenCalledWith(
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
      (mockRequestClient.post as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Call the method and expect it to throw
      await expect(media.upload(mediaBuffer, mimeType, category))
        .rejects.toThrow('Upload failed');
      
      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
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
      (mockRequestClient.get as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await media.getStatus(mediaId);
      
      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledWith(
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
      (mockRequestClient.get as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Call the method and expect it to throw
      await expect(media.getStatus(mediaId))
        .rejects.toThrow('Status check failed');
      
      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.get).toHaveBeenCalledTimes(1);
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
      (mockRequestClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      // Call the method
      const result = await media.addMetadata(mediaId, altText, allowDownload);
      
      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledWith(
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
      (mockRequestClient.post as jest.Mock).mockResolvedValueOnce(mockResponse);
      
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
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledWith(
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
      (mockRequestClient.post as jest.Mock).mockRejectedValueOnce(mockError);
      
      // Call the method and expect it to throw
      await expect(media.addMetadata(mediaId, altText, allowDownload))
        .rejects.toThrow('Metadata update failed');
      
      // Assertions
      expect(mockOAuth2.getHeaders).toHaveBeenCalledTimes(1);
      expect(mockRequestClient.post).toHaveBeenCalledTimes(1);
    });
  });
});
