import { TwitterClient } from '../src';

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

// Get a tweet by ID
async function getTweet(id: string) {
  try {
    const tweet = await client.tweets.getTweet(id);
    console.log('Tweet:', tweet.text);
  } catch (error) {
    console.error('Error getting tweet:', error);
  }
}

// Get a user by username
async function getUser(username: string) {
  try {
    const user = await client.users.getUserByUsername(username);
    console.log('User:', user.name);
    console.log('Followers:', user.followers_count);
  } catch (error) {
    console.error('Error getting user:', error);
  }
}

// Search for tweets
async function searchTweets(query: string) {
  try {
    const response = await client.searches.search(query, { count: 10 });
    console.log(`Found ${response.statuses.length} tweets:`);
    response.statuses.forEach((tweet) => {
      console.log(`- ${tweet.text}`);
    });
  } catch (error) {
    console.error('Error searching tweets:', error);
  }
}

// Run the examples
async function runExamples() {
  // Uncomment the examples you want to run
  // await postTweet();
  // await getTweet('TWEET_ID');
  // await getUser('twitter');
  // await searchTweets('TypeScript');
}

runExamples().catch(console.error); 