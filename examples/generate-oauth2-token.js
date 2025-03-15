const crypto = require('crypto');
const axios = require('axios');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const clientId = 'your_client_id_here';
const redirectUri = 'http://localhost:3000/callback';
const scopes = ['tweet.read', 'tweet.write', 'offline.access'];

// Generate PKCE parameters
const state = crypto.randomBytes(16).toString('hex');
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

// Generate authorization URL
const authorizeUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

console.log('Please visit this URL to authorize your application:');
console.log(authorizeUrl);

// Prompt for authorization code and exchange it for tokens
readline.question('Please enter the authorization code from the browser: ', async (code) => {
  try {
    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In (seconds):', expires_in);

    // Post a tweet as an example
    await postTweet(access_token, 'Hello from Node.js console!');
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  } finally {
    readline.close();
  }
});

// Function to post a tweet
async function postTweet(accessToken, text) {
  try {
    const response = await axios.post(
      'https://api.twitter.com/2/tweets',
      { text },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Tweet posted:', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response?.data || error.message);
  }
}
