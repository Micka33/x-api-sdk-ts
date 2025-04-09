<h1 align="center">x-api-sdk-ts</h1>

<p align="center">
<a href="https://www.npmjs.com/package/x-api-sdk-ts" target="_blank"><img src="https://img.shields.io/npm/v/x-api-sdk-ts?sanitize=true" alt="Version"></a>
<a href="https://bundlephobia.com/package/x-api-sdk-ts" target="_blank"><img src="https://badgen.net/bundlephobia/dependency-count/x-api-sdk-ts" alt="Dependency Count"></a>
<a href="https://github.com/Micka33/x-api-sdk-ts/actions/workflows/node.js.yml" target="_blank">
  <img alt="Node.js Tests Passing" src="https://github.com/Micka33/x-api-sdk-ts/actions/workflows/node.js.yml/badge.svg" />
</a>
<a href="https://github.com/Micka33/x-api-sdk-ts/graphs/contributors" target="_blank">
  <img alt="GitHub Contributors" src="https://img.shields.io/github/contributors/Micka33/x-api-sdk-ts" />
</a>
<a href="https://www.npmjs.com/package/x-api-sdk-ts" target="_blank"><img src="https://img.shields.io/npm/l/x-api-sdk-ts?sanitize=true" alt="License"></a>
<a href="https://github.com/Micka33/x-api-sdk-ts/issues/new/choose" target="_blank"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs"></a>
</p>

<p align="center">Simple and versatile typescript SDK for X Api.</p>

<p align="center">
  <a href="https://x.com/DrHistoryX" target="_blank">See it in action on X(Twitter)</a>
</p>

<p align="center">Love the project? Please consider <a href="https://www.paypal.com/donate/?hosted_button_id=JQTSZBUL54LHG" target="_blank">donating</a> to help it improve!</p>

## Overview

x-api-sdk-ts is a flexible TypeScript SDK for the X API, providing a type-safe, and intuitive interface to interact with v2 endpoints.  

*Twitter's v1.1 endpoints are not supported, but can be implemented. if this is something you need, please open an issue.*  

NB: Official X library is currently not ready for production. The documentation is lacking, but still, it's worth checking it out: [twitter-api-typescript-sdk](https://github.com/xdevplatform/twitter-api-typescript-sdk).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Generate OAuth2 token from console](#generate-oauth2-token-from-console)
- [Understanding the responses](#understanding-the-responses)
- [Examples](#examples)
  - [Scripts](#scripts)
  - [Authentication](#authentication)
  - [Get accessToken and refreshToken](#get-accesstoken-and-refreshtoken)
  - [Set accessToken and refreshToken](#set-accesstoken-and-refreshtoken)
  - [Check for successful response](#check-for-successful-response)
    - [Usage example](#usage-example)
  - [Media Upload](#media-upload)
    - [Reduce your API usage](#reduce-your-api-usage)
      - [Upload with custom chunk size](#upload-with-custom-chunk-size)
      - [Upload with custom minimum waiting time](#upload-with-custom-minimum-waiting-time)
  - [Get Media Upload Status](#get-media-upload-status)
  - [Add Metadata to Media](#add-metadata-to-media)
  - [Create Post](#create-post)
  - [Delete Post](#delete-post)
  - [Get One Post](#get-one-post)
  - [Get Several Posts](#get-several-posts)
  - [Like Post](#like-post)
  - [Get Authenticated User Info](#get-authenticated-user-info)
- [Change Base URL](#change-base-url)
- [Change HTTP Adapter](#change-http-adapter)
  - [Using Axios](#using-axios)
  - [Create a custom HTTP adapter](#create-a-custom-http-adapter)
- [Development Documentation](#development-documentation)
- [Contributing](#contributing)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Features

- Full TypeScript type definitions and JSDOC of supported endpoints.
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

```bash
npm install x-api-sdk-ts
```

## Generate OAuth2 token from console

See: [examples/generate-oauth2-token.mjs](https://github.com/Micka33/x-api-sdk-ts/blob/main/examples/generate-oauth2-token.mjs)

- **NB:**
  - Set `clientId` to your App's OAuth 2.0 Client ID
  - Set `clientSecret` to your App's OAuth 2.0 Client Secret
  - Set `redirectUri` to your App's Callback URI / Redirect URL
    - Or set your App's Callback URI / Redirect URL to `http://localhost:3000/oauth2/callback`

## Understanding the responses

The SDK returns a response object with the following structure:
```ts
{
  data: T | IXError | string | null | undefined; // the response data from twitter
  ok: boolean; // HTTP code >= 200 && < 300
  status: number; // HTTP code
  headers: Headers; // response headers
  rateLimitInfo: IRateLimitInfo; // brought from the response headers for convenience
}
```

Whatever X Api returns will be stored in the `data` property.  
As example, if you call the `twitterClient.posts.create` method, the response data type `T` will be [`ICreatePostResponse`](https://github.com/Micka33/x-api-sdk-ts/blob/main/src/types/x-api/posts/create_post_response.ts) which maps directly to X's documentation [Creation of a Post](https://docs.x.com/x-api/posts/creation-of-a-post#response-data).

This is true for all the endpoints.

## Examples

### Scripts

you will find some examples in the [examples](https://github.com/Micka33/x-api-sdk-ts/tree/main/examples) folder.

- [examples/basic-usage.ts](https://github.com/Micka33/x-api-sdk-ts/blob/main/examples/basic-usage.ts)
- [examples/generate-oauth2-token.mjs](https://github.com/Micka33/x-api-sdk-ts/blob/main/examples/generate-oauth2-token.mjs)
- [examples/media-upload.ts](https://github.com/Micka33/x-api-sdk-ts/blob/main/examples/media-upload.ts)

### Authentication

The SDK supports OAuth 2.0 (for v2 API).  
*It is designed to be easily extendable to support OAuth 1.0a (for v1.1 API) in the future. if this is something you need, please open an issue.*

```typescript
import { TwitterApiScope, TwitterClient } from 'x-api-sdk-ts';

const clientId = 'input_client_id_here';
const clientSecret = 'input_client_secret_here';
const redirectUri = 'http://localhost:3000/oauth2/callback';
const scopes = [ TwitterApiScope.UsersRead, TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.OfflineAccess, TwitterApiScope.MediaWrite ];

const accessToken = 'input_access_token_here';
const refreshToken = 'input_refresh_token_here';
const tokenExpiresAt = new Date('input_token_expires_at_here').getTime();

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

### Check for successful response

For convenience, the SDK provides 2 methods to check a response and assert its type.  
They are accessible from the `twitterClient` object.

```typescript
twitterClient.isSuccessResponse<T>(response: RCResponse<T>): response is RCResponseSimple<T>;
twitterClient.isErrorResponse<T>(response: RCResponse<T>): response is RCResponse<never>;
```

#### Usage example

```typescript
const postResponse = await twitterClient.posts.create('Hello World!');
if (twitterClient.isSuccessResponse(postResponse)) {
  // postResponse.data is of type ICreatePostResponse
  console.log('Successfully posted tweet');
}
if (twitterClient.isErrorResponse(postResponse)) {
  // postResponse.data is of type XError | string | undefined | null
  console.log('Failed to post tweet');
}
```


### Media Upload

The `upload` method automatically handles the chunked upload process. (Read more about it in [X API Documentation](https://docs.x.com/en/x-api/media/quickstart/media-upload-chunked))  
The file is uploaded in chunks of MIN(4MB, MAX(1MB, media.length / 10)).  

```typescript
const mediaResponse = await twitterClient.media.upload(
  fs.readFileSync('path/to/media/doge.jpeg'),
  'image/jpeg',
  'tweet_image'
);
if (!twitterClient.isSuccessResponse(mediaResponse)) {
  console.error('Failed uploading media:', JSON.stringify(mediaResponse, null, 2));
}
const mediaData = mediaResponse.data;
const mediaId = mediaData.data.id;
```

#### Reduce your API usage

You can reduce your API usage by specifying a custom chunk size and a custom minimum waiting time.

##### Upload with custom chunk size

You can specify a custom chunk size as 5th parameter which can be bigger than 4MB.  
Note that the API has a maximum chunk size of 4MB (confirmed for free api access).

```typescript
const mediaResponse = await twitterClient.media.upload(
  fs.readFileSync('path/to/media/doge.jpeg'),
  'image/jpeg',
  'tweet_image',
  null,
  1024 * 1024 * 3 // 3MB
);
```

##### Upload with custom minimum waiting time

You can specify a custom minimum waiting time as 6th parameter.

The default minimum waiting time is 1 second and X provides a recommended minimum waiting time.  
However, on a Free API access, it is recommended to wait as long as it makes sense for your use case, in order to reduce API Usage.  
Read more about it in this issue: [#7](https://github.com/Micka33/x-api-sdk-ts/issues/7).

```typescript
const mediaResponse = await twitterClient.media.upload(
  fs.readFileSync('path/to/media/doge.jpeg'),
  'image/jpeg',
  'tweet_image',
  null,
  null,
  60 // 60 seconds
);
```

### Get Media Upload Status

```typescript
const mediaResponse = await twitterClient.media.getUploadStatus(mediaId);
if (!twitterClient.isSuccessResponse(mediaResponse)) {
  console.error('Failed get media upload status:', JSON.stringify(mediaResponse, null, 2));
}
const mediaStatus = mediaResponse.data.data.processing_info.state; // 'succeeded' | 'in_progress' | 'pending' | 'failed'
```

### Add Metadata to Media

```typescript
const mediaMetadataResponse = await twitterClient.media.addMetadata(
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
const postReponse = await twitterClient.posts.create(
  'Hello World!',
  {
    media: { media_ids: [mediaId] },
  }
);
if (!twitterClient.isSuccessResponse(postReponse)) {
  console.error('Failed creating new post with media:', JSON.stringify(postReponse, null, 2));
}
const post = postResponse.data;
const postId = post.data.id;
```

### Delete Post

```typescript
await twitterClient.posts.delete(postId);
```

### Get One Post

```typescript
const postResponse = await twitterClient.posts.get(postId, {
  mediaFields: ['alt_text', 'type', 'url', 'media_key'],
});
if (!twitterClient.isSuccessResponse(postReponse)) return;
const post = postResponse.data;
const postId = post.data.id;
const postText = post.data.text;
const postAuthorId = post.data.author_id;
const postUsername = post.data.username;
const postMediaKey = post.data.attachments?.media_keys?.[0];
const otherpostMediaKey = post.includes?.media?.[0].media_keys?.[0];
```

### Get Several Posts

```typescript
const postsResponse = await twitterClient.posts.getMultiple([postId1, postId2, postId3], {
  mediaFields: ['alt_text', 'type', 'url', 'media_key'],
});
if (!twitterClient.isSuccessResponse(postsResponse)) return;
const posts = postsResponse.data;
const post1 = posts.data[0];
const post2 = posts.data[1];
const post3 = posts.data[2];
```

### Like Post

```typescript
const likeResponse = await twitterClient.likes.add(postId);
if (!twitterClient.isSuccessResponse(likeResponse)) return;
const like = likeResponse.data;
const liked = like.data.liked;
```

### Get Authenticated User Info

```typescript
const userResponse = await twitterClient.users.getMe();
if (!twitterClient.isSuccessResponse(userResponse)) return;
const user = userResponse.data;
const userId = user.data.id;
const userName = user.data.name;
const userUsername = user.data.username;
```

## Change Base URL

By default the SDK uses the X API base URL: `https://api.x.com`.  
You can change the base URL by setting the `baseUrl` parameter in the constructor.

```typescript

const twitterClient = new TwitterClient(config, { baseUrl: 'https://api.twitter.com' });
```

## Change HTTP Adapter

By default, the SDK uses the `FetchAdapter`, which is a thin wrapper around the native `fetch` API.  
You can change the HTTP adapter by setting the `httpAdapter` parameter in the constructor.

### Using Axios

`x-api-sdk-ts` comes bundled with an Axios adapter.  
To use it, you need to install the `axios` package.

```bash
npm install axios
```

And then use it like this:

```typescript
import axios from 'axios';
import { AxiosAdapter, TwitterApiScope, TwitterClient } from 'x-api-sdk-ts';

axios.defaults.adapter = 'http'; // see: https://github.com/axios/axios?tab=readme-ov-file#-fetch-adapter

const config = {/**/};
const twitterClient = new TwitterClient(config, { httpAdapter: [AxiosAdapter, axios] });
```

### Create a custom HTTP adapter

You can create your own custom HTTP adapter by implementing the `IHttpAdapter` interface.

```typescript
import { IHttpAdapter, IHttpFetchResponse } from 'x-api-sdk-ts';

export class CustomHttpAdapter implements IHttpAdapter {
  constructor(private paramA: string, private paramB: number) {}
  public fetch<T>(url: string, options?: RequestInit): Promise<IHttpFetchResponse<T>> {
    return fetch(url, options);
  }
}
```

And then use it like this:

```typescript
const twitterClient = new TwitterClient(config, {
  httpAdapter: [CustomHttpAdapter, 'paramA', 'paramB']
});
```


## Development Documentation

See [Development Documentation](https://github.com/Micka33/x-api-sdk-ts/blob/main/DEVELOPMENT.md).

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
