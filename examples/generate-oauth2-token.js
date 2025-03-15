const crypto = require('crypto');
const axios = require('axios');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

// Configuration
const clientId = 'your_client_id_here';
const clientSecret = 'your_client_secret_here';
const redirectUri = 'http://localhost:3000/oauth2/callback';
const scopes = ['users.read', 'tweet.read', 'tweet.write', 'offline.access'];

// Function for base64url encoding
function base64urlEncode(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Generate PKCE parameters
const state = crypto.randomBytes(16).toString('hex');
const codeVerifier = base64urlEncode(crypto.randomBytes(32));
const codeChallenge = base64urlEncode(
  crypto.createHash('sha256').update(codeVerifier).digest()
);

// Generate authorization URL
const authorizeUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

console.log('Please visit this URL to authorize your application:');
console.log(authorizeUrl);

// Prompt for authorization code and exchange it for tokens
readline.question('Please enter the authorization code from the browser: ', async (code) => {
  try {
    // Basic Auth header
    const authHeader = 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const tokenResponse = await axios.post(
      'https://api.twitter.com/2/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader,
        },
      }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Expires In (seconds):', expires_in);

    // Post a tweet as an example
    // await postTweet(access_token, 'Hello World!');
    await getUser(access_token);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  } finally {
    readline.close();
  }
});

async function getUser(accessToken) {
  try {
    const response = await axios.get(
      'https://api.twitter.com/2/users/me',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('User:', response.data);
  } catch (error) {
    console.error('Error fetching user:', error.response?.data || error.message);
  }
}

// Function to post a tweet
async function postTweet(accessToken, text) {
  try {
    const response = await axios.post(
      'https://api.twitter.com/2/tweets',
      { text },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      }
    );
    console.log('Tweet posted:', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response?.data || error.message);
  }
}
