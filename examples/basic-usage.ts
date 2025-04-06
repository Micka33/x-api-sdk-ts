import { TwitterApiScope, TwitterClient } from '../dist';

// Create a client with OAuth 2.0 credentials
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

// Post a tweet
async function postTweet() {
  try {
    const tweetResponse = await client.posts.create('Hello, Twitter!');
    if (client.isSuccessResponse(tweetResponse)) {
      console.log('Tweet posted:', tweetResponse.data);
    } else {
      console.error('Error posting tweet:', tweetResponse);
    }
  } catch (error) {
    console.error('Caught error posting tweet:', error);
  }
}

// Get a tweet by ID
async function getTweet(id: string) {
  try {
    const tweetResponse = await client.posts.get(id);
    if (client.isSuccessResponse(tweetResponse)) {
      console.log('Tweet:', tweetResponse.data);
    } else {
      console.error('Error getting tweet:', tweetResponse);
    }
  } catch (error) {
    console.error('Caught error getting tweet:', error);
  }
}

// Get a authenticated user
async function getAuthenticatedUser() {
  try {
    const userResponse = await client.users.getMe();
    if (client.isSuccessResponse(userResponse)) {
      console.log('User:', userResponse.data);
    } else {
      console.error('Error getting user:', userResponse);
    }
  } catch (error) {
    console.error('Caught error getting user:', error);
  }
}

// Run the examples
async function runExamples() {
  // Uncomment the examples you want to run
  // await postTweet();
  // await getTweet('TWEET_ID');
  // await getAuthenticatedUser();
}

await runExamples();
