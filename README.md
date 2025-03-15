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

## Quick Start

## Authentication

The SDK supports both OAuth 1.0a (for v1.1 API) and OAuth 2.0 (for v2 API):

## Generate OAuth2 token from console

See: [examples/generate-oauth2-token.js](https://github.com/Micka33/x-sdk-ts/blob/main/examples/generate-oauth2-token.js)

- **NB:**
  - Set `clientId` to your App's OAuth 2.0 Client ID
  - Set `redirectUri` to your App's Callback URI / Redirect URL
    - Or set your App's Callback URI / Redirect URL to `http://localhost:3000/oauth2/callback`

## Media Upload Example

## Get Media Upload Status Example

## Add Metadata to Media Example

## Create Post Example

## Delete Post Example

## Get One Post Example

## Get Several Posts Example

## Like Post Example

## Get Authenticated User Info Example

## Documentation

For detailed documentation, see the [API Documentation](https://micka33.github.io/x-sdk-ts/).

## Contributing

Contributions are welcome! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
