import { TwitterApiScope, TwitterClient } from '../src';
import * as fs from 'fs';
import * as path from 'path';

// Create a client with OAuth 1.0a credentials
const client = new TwitterClient({
  oAuth2: {
    clientId: '',
    clientSecret: '',
    scopes: [TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.UsersRead, TwitterApiScope.OfflineAccess],
    redirectUri: '',
    accessToken: '',
    refreshToken: '',
    tokenExpiresAt: Date.now(),
  },
});

// Upload an image and post a tweet with it
async function uploadImageAndTweet(imagePath: string, altText: string, tweetText: string) {
  try {
    console.log(`Reading image from ${imagePath}...`);
    const imageBuffer = fs.readFileSync(imagePath);
    
    console.log('Uploading image...');
    const media = await client.media.upload(
      imageBuffer,
      getMimeType(imagePath),
      'tweet_image'
    );
    if (!('data' in media)) {
      console.error('Error uploading image:', media);
      return;
    }
    console.log(`Image uploaded with media_id: ${media.data.id}`);
    
    console.log('Posting tweet with image...');
    const postResponse = await client.posts.create(tweetText, {
      media: {media_ids: [media.data.id]}
    });
    if (!('data' in postResponse)) {
      console.error('Error posting tweet:', JSON.stringify(postResponse, null, 2));
      return;
    }
    console.log(`Tweet posted: https://twitter.com/user/status/${postResponse.data.id}`);
    return postResponse.data;
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
    const media = await client.media.upload(
      videoBuffer,
      getMimeType(videoPath),
      'tweet_video'
    );
    if (!('data' in media)) {
      console.error('Error uploading video:', media);
      return;
    }
    console.log(`Video uploaded with media_id: ${media.data.id}`);
    
    
    // Check if the video is still processing
    if (media.data.processing_info?.state !== 'succeeded') {
      console.log('Video upload failed.', JSON.stringify(media, null, 2));
      return;
    }
    
    console.log('Posting tweet with video...');
    const postResponse = await client.posts.create(tweetText, {
      media: {media_ids: [media.data.id]}
    });
    if (!('data' in postResponse)) {
      console.error('Error posting tweet:', JSON.stringify(postResponse, null, 2));
      return;
    }
    
    console.log(`Tweet posted: https://twitter.com/user/status/${postResponse.data.id}`);
    return postResponse.data;
  } catch (error) {
    console.error('Error uploading video and posting tweet:', error);
    throw error;
  }
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