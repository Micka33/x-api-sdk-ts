!! UNDER CONSTRUCTION !!

# x-sdk-ts

Simple and versatile typescript SDK for X Api.

## Overview

x-sdk-ts is a flexible TypeScript SDK for the Twitter API, providing a type-safe, and intuitive interface to interact with Twitter's v1.1 and v2 endpoints.

## Features

- Full TypeScript type definitions of supported endpoints.
- Partial implementation of Twitter API v1.1 and v2 endpoints.
- Support authentication for OAuth 1.0a (v1.1) and OAuth 2.0 (v2).
- Modular architecture for easy customization and extension using depencencies injection.
- Only 1 dependency to [oauth-1.0a](https://github.com/ddo/oauth-1.0a) to support OAuth 1.0a (v1.1).
- Supported v2 endpoints:
  - Media
    - Upload media
    - Get upload status
    - Add metadata to media
  - Posts
    - Create a post
    - Get one or several posts at once
    - Delete a post
  - Likes
    - Like a post
  - Users
    - Get information about the authenticated user

## Installation

## Generate OAuth2 token from console

See: [examples/generate-oauth2-token.js](https://github.com/Micka33/x-sdk-ts/blob/main/examples/generate-oauth2-token.js)

- **NB:**
  - Set `clientId` to your App's OAuth 2.0 Client ID
  - Set `clientSecret` to your App's OAuth 2.0 Client Secret
  - Set `redirectUri` to your App's Callback URI / Redirect URL
    - Or set your App's Callback URI / Redirect URL to `http://localhost:3000/oauth2/callback`

## Authentication

The SDK supports both OAuth 1.0a (for v1.1 API) and OAuth 2.0 (for v2 API).

```typescript
const clientId = 'input_client_id_here';
const clientSecret = 'input_client_secret_here';
const redirectUri = 'http://localhost:3000/oauth2/callback';
const scopes = [TwitterApiScope.UsersRead, TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.OfflineAccess];

const accessToken = 'input_access_token_here';
const refreshToken = 'input_refresh_token_here';
const tokenExpiresAt = 'input_token_expires_at_here';

// Initialize the Twitter client
const twitterClient = new TwitterClient({
  oAuth1: { apiKey: '', apiSecret: '' }, // if you don't need the OAuth 1.0a, use empty strings
  oAuth2: { clientId, clientSecret, scopes, redirectUri, accessToken, refreshToken, tokenExpiresAt },
});
```

### Get accessToken and refreshToken

```typescript
const token = twitterClient.oAuth2.getToken();
const { accessToken, refreshToken, tokenExpiresAt } = token;
```

### Change accessToken and refreshToken

```typescript
twitterClient.oAuth2.setToken(accessToken, refreshToken, tokenExpiresAt);
```

## Media Upload Example

```typescript
const media = await twitterClient.media.uploadMedia(
  Buffer.from(fs.readFileSync('path/to/media/doge.jpeg')),
  'image/jpeg',
  'tweet_image'
);
const mediaId = media.data.id;
```

## Get Media Upload Status Example

```typescript
const media = await twitterClient.media.getMediaUploadStatus(mediaId);
const mediaStatus = media.data.processing_info.state; // 'succeeded' | 'in_progress' | 'pending' | 'failed'
```

## Add Metadata to Media Example

```typescript
const mediaMetadata = await twitterClient.media.addMetadata(
  mediaId,                          // media id
  'A smiling dog profile picture',  // alt text
  true,                             // allow download
  'u5BzatR15TZ04',                  // optional, original media id
  'giphy',                          // optional, original media provider
  'gallery'                         // optional, upload source
);
```

## Create Post Example

```typescript
const post = await twitterClient.posts.createPost(
  'Hello World!',
  {
    media: { media_ids: [mediaId] },
  }
);
const postId = post.data.id;
```

## Delete Post Example

```typescript
await twitterClient.posts.deletePost(postId);
```

## Get One Post Example

```typescript
const post = await twitterClient.posts.getPost(postId, {
  mediaFields: ['alt_text', 'type', 'url', 'media_key'],
});
const postId = post.data.id;
const postText = post.data.text;
const postAuthorId = post.data.author_id;
const postUsername = post.data.username;
const postMediaKey = post.data.attachments?.media_keys?.[0];
const otherpostMediaKey = post.includes?.media?.[0].media_keys?.[0];
```

## Get Several Posts Example

```typescript
const posts = await twitterClient.posts.getPosts([postId1, postId2, postId3], {
  mediaFields: ['alt_text', 'type', 'url', 'media_key'],
});
const post1 = posts.data[0];
const post2 = posts.data[1];
const post3 = posts.data[2];
```

## Like Post Example

```typescript
const like = await twitterClient.posts.likePost(postId);
const liked = like.data.liked;
```

## Get Authenticated User Info Example

```typescript
const user = await twitterClient.users.getMe();
const userId = user.data.id;
const userName = user.data.name;
const userUsername = user.data.username;
```

## Documentation

<!-- 
For detailed documentation, see the [API Documentation](https://micka33.github.io/x-sdk-ts/).
-->

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
