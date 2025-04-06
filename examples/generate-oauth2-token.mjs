import axios from 'axios';
import { createInterface } from 'readline';
import { TwitterClient, TwitterApiScope, AxiosAdapter } from '../dist/index.js';

axios.defaults.adapter = 'http';

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const clientId = '';
const clientSecret = '';
const redirectUri = 'http://localhost:3000/oauth2/callback';
const scopes = [TwitterApiScope.UsersRead, TwitterApiScope.TweetRead, TwitterApiScope.TweetWrite, TwitterApiScope.OfflineAccess, TwitterApiScope.MediaWrite];

// Set the access token and refresh token to null to generate a new token
const accessToken = null;
const refreshToken = null;
const tokenExpiresAt = null; // new Date("2025-04-06T17:19:14.405Z").getTime();

const httpAdapter = [AxiosAdapter, axios]; // default is `[FetchAdapter]`

// Initialize the Twitter client
const twitterClient = new TwitterClient({
  oAuth2: { clientId, clientSecret, scopes, redirectUri, accessToken, refreshToken, tokenExpiresAt },
}, { httpAdapter });

// Check if the access token was provided in the config
if (!twitterClient.oAuth2.getToken().accessToken) {

  // Generate authorization URL
  const authorizeUrl = twitterClient.oAuth2.generateAuthorizeUrl();
  console.log('Please visit this URL to authorize your application:');
  console.log(authorizeUrl);

  // Prompt for authorization code and exchange it for tokens
  readline.question('Please enter the authorization code from the browser: ', async (code) => {
    try {
      // Exchange the code for tokens using OAuth2Auth
      await twitterClient.oAuth2.exchangeAuthCodeForToken(code);
      // Display the token information and get user info
      await displayTokenInfoAndGetUserInfo()
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      readline.close();
    }
  });


} else {
  // if the access token was provided in the config

  // close the readline as we don't need it
  readline.close();

  // Check if it's expired and refresh it if it is
  if (twitterClient.oAuth2.isTokenExpired()) {
    await twitterClient.oAuth2.refreshAccessToken();
  }
  // display the token information and get user info
  await displayTokenInfoAndGetUserInfo();
}

async function displayTokenInfoAndGetUserInfo() {
  // Get and display the token information
  const { accessToken, refreshToken, tokenExpiresAt } = twitterClient.oAuth2.getToken();
  console.log('Access Token:', accessToken);
  console.log('Refresh Token:', refreshToken);
  console.log('Expires At:', new Date(tokenExpiresAt).toISOString());
  console.log('Expires In (seconds):', Math.floor((tokenExpiresAt - Date.now()) / 1000));

  // Get user information
  let userResponse = await twitterClient.users.getMe(['id', 'name', 'username']);
  console.log('UserResponse:', userResponse);
  if (twitterClient.isSuccessResponse(userResponse)) {
    console.log('Successfully got user info');
  } else {
    console.log('Failed to get user info');
  }
  // Post a tweet
  const tweetResponse = await twitterClient.posts.create('Hello World!');
  if (twitterClient.isSuccessResponse(tweetResponse)) {
    console.log('Successfully posted tweet');
  } else {
    console.log('Failed to post tweet');
  }
}
