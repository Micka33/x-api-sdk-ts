import { TwitterApiScope, TwitterClient } from '../src';

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
    const tweet = await client.posts.create('Hello, Twitter!');
    if ('data' in tweet) {
      console.log('Tweet posted:', tweet.data.id);
    } else {
      console.error('Error posting tweet:', tweet);
    }
  } catch (error) {
    console.error('Caught error posting tweet:', error);
  }
}

// Get a tweet by ID
async function getTweet(id: string) {
  try {
    const tweet = await client.posts.get(id);
    if ('data' in tweet) {
      console.log('Tweet:', tweet.data.text);
    } else {
      console.error('Error getting tweet:', tweet);
    }
  } catch (error) {
    console.error('Caught error getting tweet:', error);
  }
}

// Get a authenticated user
async function getAuthenticatedUser() {
  try {
    const user = await client.users.getMe();
    if ('data' in user) {
      console.log('User:', user.data.username);
    } else {
      console.error('Error getting user:', user);
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
