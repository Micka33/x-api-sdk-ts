import { TwitterClient } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// Create a client with OAuth 1.0a credentials
const client = TwitterClient.createClient({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
});

// Upload an image and post a tweet with it
async function uploadImageAndTweet(imagePath: string, altText: string, tweetText: string) {
  try {
    console.log(`Reading image from ${imagePath}...`);
    const imageBuffer = fs.readFileSync(imagePath);
    
    console.log('Uploading image...');
    const media = await client.media.uploadMedia(imageBuffer, {
      mimeType: getMimeType(imagePath),
      altText,
    });
    
    console.log(`Image uploaded with media_id: ${media.media_id}`);
    
    console.log('Posting tweet with image...');
    const tweet = await client.tweets.postTweet(tweetText, {
      mediaIds: [media.media_id],
    });
    
    console.log(`Tweet posted: https://twitter.com/user/status/${tweet.id}`);
    return tweet;
  } catch (error) {
    console.error('Error uploading image and posting tweet:', error);
    throw error;
  }
}

// Upload a video and post a tweet with it
async function uploadVideoAndTweet(videoPath: string, tweetText: string) {
  try {
    console.log(`Reading video from ${videoPath}...`);
    const videoBuffer = fs.readFileSync(videoPath);
    
    console.log('Uploading video...');
    const media = await client.media.uploadMedia(videoBuffer, {
      mimeType: getMimeType(videoPath),
      category: 'tweet_video',
    });
    
    console.log(`Video uploaded with media_id: ${media.media_id}`);
    
    // Check if the video is still processing
    if (media.processing_info && media.processing_info.state !== 'succeeded') {
      console.log('Video is still processing. Waiting...');
      await waitForMediaProcessing(media.media_id);
    }
    
    console.log('Posting tweet with video...');
    const tweet = await client.tweets.postTweet(tweetText, {
      mediaIds: [media.media_id],
    });
    
    console.log(`Tweet posted: https://twitter.com/user/status/${tweet.id}`);
    return tweet;
  } catch (error) {
    console.error('Error uploading video and posting tweet:', error);
    throw error;
  }
}

// Wait for media processing to complete
async function waitForMediaProcessing(mediaId: string): Promise<void> {
  const media = await client.media.getMedia(mediaId);
  
  if (!media.processing_info) {
    return;
  }
  
  const { state, check_after_secs } = media.processing_info;
  
  if (state === 'succeeded') {
    return;
  }
  
  if (state === 'failed') {
    throw new Error('Media processing failed');
  }
  
  console.log(`Media processing: ${state}. Checking again in ${check_after_secs} seconds...`);
  
  // Wait for the specified time before checking again
  await new Promise((resolve) => setTimeout(resolve, check_after_secs * 1000));
  
  // Check again
  return waitForMediaProcessing(mediaId);
}

// Get the MIME type based on the file extension
function getMimeType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  
  switch (extension) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.gif':
      return 'image/gif';
    case '.webp':
      return 'image/webp';
    case '.mp4':
      return 'video/mp4';
    case '.mov':
      return 'video/quicktime';
    default:
      throw new Error(`Unsupported file extension: ${extension}`);
  }
}

// Run the examples
async function runExamples() {
  // Uncomment the examples you want to run
  // await uploadImageAndTweet(
  //   'path/to/image.jpg',
  //   'Description of the image for accessibility',
  //   'Check out this image! #TwitterAPI'
  // );
  
  // await uploadVideoAndTweet(
  //   'path/to/video.mp4',
  //   'Check out this video! #TwitterAPI'
  // );
}

runExamples().catch(console.error); 