import nock from 'nock';
import { readFileSync } from 'fs';
import { join } from 'path';
import type { IUploadMediaResponse, TwitterClient } from '../../src';
import { initializeTwitterClient, Config, initializeNock, getFixtureResponse } from './helpers';


describe('Media Integration Tests', () => {
  let twitterClient: TwitterClient;
  let recordingMode: boolean;
  let testImagePath: string = join(__dirname, 'fixtures', 'media', 'test-image.png');
  
  beforeAll(async () => {
    recordingMode = Config.recordingMode;
    twitterClient = initializeTwitterClient(Config);
    initializeNock(nock, 'media', recordingMode);
  });

  describe('upload', () => {
    it('should upload an image successfully', async () => {
      function prepareScope(scope: nock.Scope) {
        scope.filteringRequestBody((body, recordedBody) => {
          // just return the recorded body
          // because the body is a binary image
          // and we don't need to compare it
          return recordedBody;
        });
      }
      // we don't need to prepare the scope in recording mode
      const options = Config.recordingMode ? {} : {
        after: prepareScope,
      };
      // Load a test image from fixtures
      const imageBuffer = readFileSync(testImagePath);
      // After saving the fixture, add the following headers in `rawHeaders` of the first and last requests
      // "content-encoding": "gzip",
      // "content-type": "application/json; charset=utf-8"
      const { nockDone } = await nock.back('uploadImageSuccess.json', options);
      // Upload the image
      const response = await twitterClient.media.upload(
        imageBuffer,
        'image/png',
        'tweet_image'
      );
      nockDone();

      if (twitterClient.isSuccessResponse(response)) {
        expect(response.data.data.id).toBeDefined();
      } else {
        console.error('should upload an image successfully - response', JSON.stringify(response, null, 2));
        fail('Expected successful response but got error');
      }
    });

  //   it('should handle errors when uploading invalid media', async () => {
  //     const { nockDone } = await nock.back('uploadInvalidMediaError.json');
      
  //     // Create an invalid media buffer (empty)
  //     const invalidBuffer = Buffer.from([]);
      
  //     // Try to upload invalid media
  //     const response = await twitterClient.media.upload(
  //       invalidBuffer,
  //       'image/jpeg',
  //       'tweet_image'
  //     );
  //     nockDone();
      
  //     if (isErrorResponse(response)) {
  //       expect(response.title).toBeDefined();
  //       expect(response.type).toContain('problems');
  //     } else {
  //       fail('Expected error response but got success');
  //     }
  //   });
  });

  describe('getStatus', () => {
    it ('must be tested with a GIF or video', () => {
      expect(true).toBe(true);
    });
    // it('should get the status of an uploaded media', async () => {
    //   const { nockDone } = await nock.back('getMediaStatusSuccess.json');
      
    //   // Use a media ID from a previous upload or fixture
    //   const mediaFixture = getFixtureResponse('media', 'uploadImageSuccess.json');
    //   const mediaId = mediaFixture.data.media_id_string;
      
    //   // Get status
    //   const response = await twitterClient.media.getStatus(mediaId);
    //   nockDone();
    //   console.log('response', JSON.stringify(response, null, 2));
    //   if (isErrorResponse(response)) {
    //     fail('Expected successful response but got error');
    //   } else {
    //     const data = response.data;
    //     // Explicitly cast to any to access Twitter API specific fields
    //     expect(data.id).toBeDefined();
    //     expect(data.processing_info?.state).toBeDefined();
    //   }
    // });

  //   it('should handle errors when getting status with invalid media ID', async () => {
  //     const { nockDone } = await nock.back('getMediaStatusInvalidIdError.json');
      
  //     // Use an invalid media ID
  //     const invalidMediaId = 'invalid-media-id';
      
  //     // Try to get status
  //     const response = await twitterClient.media.getStatus(invalidMediaId);
  //     nockDone();
      
  //     if (isErrorResponse(response)) {
  //       expect(response.title).toBeDefined();
  //       expect(response.type).toContain('problems');
  //     } else {
  //       fail('Expected error response but got success');
  //     }
  //   });
  });

  describe('addMetadata', () => {
    it('should add metadata to an uploaded media', async () => {
      // Use a media ID from a previous upload or fixture
      const mediaFixture = getFixtureResponse('media', 'uploadImageSuccess.json', 4);
      // Cast to any to access Twitter API specific fields
      const mediaId = (mediaFixture as IUploadMediaResponse).data.id;
      // Add metadata
      const { nockDone } = await nock.back('addMetadataSuccess.json');
      const response = await twitterClient.media.addMetadata(
        mediaId,
        'Hooman with a bass',
        true
      );
      nockDone();
      // The successful response might be empty or have a success indication
      if (twitterClient.isSuccessResponse(response)) {
        expect(response.data.data.id).toBeDefined();
        expect(response.data.data.associated_metadata.alt_text?.text).toBe('Hooman with a bass');
        expect(response.data.data.associated_metadata.allow_download_status?.allow_download).toBe(true);
      } else {
        fail('Expected successful response but got error');
      }
    });

  //   it('should handle errors when adding metadata with invalid media ID', async () => {
  //     const { nockDone } = await nock.back('addMetadataInvalidIdError.json');
      
  //     // Use an invalid media ID
  //     const invalidMediaId = 'invalid-media-id';
      
  //     // Try to add metadata
  //     const response = await twitterClient.media.addMetadata(
  //       invalidMediaId,
  //       'Test alt text',
  //       true
  //     );
  //     nockDone();
      
  //     if (isErrorResponse(response)) {
  //       expect(response.title).toBeDefined();
  //       expect(response.type).toContain('problems');
  //     } else {
  //       fail('Expected error response but got success');
  //     }
  //   });
  });
});
