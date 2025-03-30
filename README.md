!! UNDER CONSTRUCTION !!

# x-api-sdk-ts

Simple and versatile typescript SDK for X Api.

I don't recommend using this SDK in production, but it can be used as a reference for building your own SDK.  
I recommend to use [twitter-api-typescript-sdk](https://github.com/xdevplatform/twitter-api-typescript-sdk) instead.  

## Overview

x-api-sdk-ts is a flexible TypeScript SDK for the X API, providing a type-safe, and intuitive interface to interact with v2 endpoints.  

*Twitter's v1.1 endpoints are not supported, but can be implemented. if this is something you need, please open an issue.*  

## Features

- Full TypeScript type definitions of supported endpoints.
- Partial implementation of Twitter API v2 endpoints.
- Support authentication for OAuth 2.0 (v2).
- Modular architecture for easy customization and extension using depencencies injection.
- 0 dependencies.
- Supported v2 endpoints:
  - Media
    - Upload
    - Get status
    - Add metadata
  - Posts
    - Create
    - Get
    - GetMultiple
    - Delete
  - Likes
    - Add
  - Users
    - Get information about the authenticated user

## Installation

## Generate OAuth2 token from console

See: [examples/generate-oauth2-token.mjs](https://github.com/Micka33/x-api-sdk-ts/blob/main/examples/generate-oauth2-token.mjs)

- **NB:**
  - Set `clientId` to your App's OAuth 2.0 Client ID
  - Set `clientSecret` to your App's OAuth 2.0 Client Secret
  - Set `redirectUri` to your App's Callback URI / Redirect URL
    - Or set your App's Callback URI / Redirect URL to `http://localhost:3000/oauth2/callback`

## Examples

### Authentication

The SDK supports OAuth 2.0 (for v2 API).  
*It is designed to be easily extendable to support OAuth 1.0a (for v1.1 API) in the future. if this is something you need, please open an issue.*

```typescript
const clientId = 'input_client_id_here';
const clientSecret = 'input_client_secret_here';
const redirectUri = 'http://localhost:3000/oauth2/callback';
const scopes = [TwitterApiScope.UsersRead, TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.OfflineAccess, TwitterApiScope.MediaWrite];

const accessToken = 'input_access_token_here';
const refreshToken = 'input_refresh_token_here';
const tokenExpiresAt = 'input_token_expires_at_here'; // a date object; example: new Date()

// Initialize the Twitter client
const twitterClient = new TwitterClient({
  oAuth2: { clientId, clientSecret, scopes, redirectUri, accessToken, refreshToken, tokenExpiresAt },
});
```

### Get accessToken and refreshToken

```typescript
const token = twitterClient.oAuth2.getToken();
const { accessToken, refreshToken, tokenExpiresAt } = token;
```

### Set accessToken and refreshToken

```typescript
twitterClient.oAuth2.setToken(accessToken, refreshToken, tokenExpiresAt);
```

### Media Upload

```typescript
const media = await twitterClient.media.upload(
  fs.readFileSync('path/to/media/doge.jpeg'),
  'image/jpeg',
  'tweet_image'
);
const mediaId = media.data.id;
// If media.dataprocessing_info field is NOT returned in the response, then mediaId is ready for use in other API endpoints.
// https://docs.x.com/x-api/media/quickstart/media-upload-chunked#step-2-%3A-post-media%2Fupload-append
```

### Get Media Upload Status

```typescript
const media = await twitterClient.media.getUploadStatus(mediaId);
const mediaStatus = media.data.processing_info.state; // 'succeeded' | 'in_progress' | 'pending' | 'failed'
```

### Add Metadata to Media

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

### Create Post

```typescript
const post = await twitterClient.posts.create(
  'Hello World!',
  {
    media: { media_ids: [mediaId] },
  }
);
const postId = post.data.id;
```

### Delete Post

```typescript
await twitterClient.posts.delete(postId);
```

### Get One Post

```typescript
const post = await twitterClient.posts.get(postId, {
  mediaFields: ['alt_text', 'type', 'url', 'media_key'],
});
const postId = post.data.id;
const postText = post.data.text;
const postAuthorId = post.data.author_id;
const postUsername = post.data.username;
const postMediaKey = post.data.attachments?.media_keys?.[0];
const otherpostMediaKey = post.includes?.media?.[0].media_keys?.[0];
```

### Get Several Posts

```typescript
const posts = await twitterClient.posts.getMultiple([postId1, postId2, postId3], {
  mediaFields: ['alt_text', 'type', 'url', 'media_key'],
});
const post1 = posts.data[0];
const post2 = posts.data[1];
const post3 = posts.data[2];
```

### Like Post

```typescript
const like = await twitterClient.likes.add(postId);
const liked = like.data.liked;
```

### Get Authenticated User Info

```typescript
const user = await twitterClient.users.getMe();
const userId = user.data.id;
const userName = user.data.name;
const userUsername = user.data.username;
```

## Development Documentation

See [Development Documentation](https://github.com/Micka33/x-api-sdk-ts/blob/main/DEVELOPMENT.md).

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
