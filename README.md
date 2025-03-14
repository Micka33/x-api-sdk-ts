!! UNDER CONSTRUCTION !!

# x-sdk-ts

The Fullest Implementation of the X (ex-twitter) API in a TypeScript Library

## Overview

x-sdk-ts is a comprehensive TypeScript SDK for the Twitter API, providing developers with a robust, type-safe, and intuitive interface to interact with Twitter's v1.1 and v2 endpoints. This SDK aims to fill the gaps in existing libraries by offering full support for Twitter API features, including media uploads with metadata, post usage metrics, and interactions such as likes and searches.

## Features

- Complete implementation of Twitter API v1.1 and v2 endpoints
- Modular architecture for easy customization and extension
- Robust authentication support for OAuth 1.0a (v1.1) and OAuth 2.0 (v2)
- Media upload functionality with metadata support
- Real-time streaming for tweets and other Twitter data
- Comprehensive TypeScript type definitions
- Thorough documentation and examples

## Installation

```bash
npm install x-sdk-ts
```

## Quick Start

```typescript
import { TwitterClient } from 'x-sdk-ts';

// Create a client with OAuth 1.0a credentials
const client = TwitterClient.createClient({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
});

// Post a tweet
async function postTweet() {
  try {
    const tweet = await client.tweets.postTweet('Hello, Twitter!');
    console.log('Tweet posted:', tweet.id);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}

postTweet();
```

## Authentication

The SDK supports both OAuth 1.0a (for v1.1 API) and OAuth 2.0 (for v2 API):

### OAuth 1.0a (v1.1 API)

```typescript
const client = TwitterClient.createClient({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
});
```

### OAuth 2.0 (v2 API)

```typescript
const client = TwitterClient.createClient({
  clientId: 'YOUR_CLIENT_ID',
  clientSecret: 'YOUR_CLIENT_SECRET',
  bearerToken: 'YOUR_BEARER_TOKEN',
});
```

## Media Upload Example

```typescript
import { TwitterClient } from 'x-sdk-ts';
import * as fs from 'fs';

const client = TwitterClient.createClient({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
});

async function uploadMediaAndTweet() {
  try {
    // Upload media
    const mediaBuffer = fs.readFileSync('path/to/image.jpg');
    const media = await client.media.uploadMedia(mediaBuffer, {
      mimeType: 'image/jpeg',
      altText: 'Description of the image',
    });

    // Post tweet with media
    const tweet = await client.tweets.postTweet('Check out this image!', {
      mediaIds: [media.media_id],
    });

    console.log('Tweet posted with media:', tweet.id);
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadMediaAndTweet();
```

## Streaming Example

```typescript
import { TwitterClient } from 'x-sdk-ts';

const client = TwitterClient.createClient({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
});

// Create a filtered stream
const stream = client.streams.createFilteredStream({
  track: ['javascript', 'typescript', 'nodejs'],
});

// Listen for tweets
stream.on('tweet', (tweet) => {
  console.log(`New tweet: ${tweet.text}`);
});

// Listen for errors
stream.on('error', (error) => {
  console.error('Stream error:', error);
});

// Start the stream
stream.start();

// Stop the stream after 5 minutes
setTimeout(() => {
  stream.stop();
  console.log('Stream stopped');
}, 5 * 60 * 1000);
```

## Documentation

For detailed documentation, see the [API Documentation](https://yourusername.github.io/x-sdk-ts/).

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
