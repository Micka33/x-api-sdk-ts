import { TwitterClient } from '../src';

// Create a client with OAuth 1.0a credentials
const client = TwitterClient.createClient({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  accessToken: 'YOUR_ACCESS_TOKEN',
  accessTokenSecret: 'YOUR_ACCESS_TOKEN_SECRET',
});

// Create a filtered stream based on keywords
function createFilteredStream(keywords: string[]) {
  console.log(`Creating filtered stream for keywords: ${keywords.join(', ')}...`);
  
  const stream = client.streams.createFilteredStream({
    track: keywords,
  });
  
  // Listen for tweets
  stream.on('tweet', (tweet) => {
    console.log(`[${new Date().toISOString()}] New tweet from @${tweet.author_id}:`);
    console.log(tweet.text);
    console.log('-'.repeat(80));
  });
  
  // Listen for errors
  stream.on('error', (error) => {
    console.error('Stream error:', error);
  });
  
  // Listen for warnings
  stream.on('warning', (warning) => {
    console.warn('Stream warning:', warning);
  });
  
  // Listen for disconnects
  stream.on('disconnect', (disconnectMessage) => {
    console.log('Stream disconnected:', disconnectMessage);
  });
  
  return stream;
}

// Create a sample stream
function createSampleStream() {
  console.log('Creating sample stream...');
  
  const stream = client.streams.createSampleStream();
  
  // Listen for tweets
  stream.on('tweet', (tweet) => {
    console.log(`[${new Date().toISOString()}] New tweet from @${tweet.author_id}:`);
    console.log(tweet.text);
    console.log('-'.repeat(80));
  });
  
  // Listen for errors
  stream.on('error', (error) => {
    console.error('Stream error:', error);
  });
  
  return stream;
}

// Create a user stream
function createUserStream(userIds: string[]) {
  console.log(`Creating user stream for user IDs: ${userIds.join(', ')}...`);
  
  const stream = client.streams.createUserStream(userIds);
  
  // Listen for tweets
  stream.on('tweet', (tweet) => {
    console.log(`[${new Date().toISOString()}] New tweet from @${tweet.author_id}:`);
    console.log(tweet.text);
    console.log('-'.repeat(80));
  });
  
  // Listen for errors
  stream.on('error', (error) => {
    console.error('Stream error:', error);
  });
  
  return stream;
}

// Create a rules-based stream (v2 API)
function createRulesStream(rules: Array<{ value: string; tag?: string }>) {
  console.log('Creating rules-based stream...');
  
  const stream = client.streams.createRulesStream(rules);
  
  // Listen for tweets
  stream.on('tweet', (tweet) => {
    console.log(`[${new Date().toISOString()}] New tweet matching rules:`);
    console.log(tweet.text);
    console.log('-'.repeat(80));
  });
  
  // Listen for errors
  stream.on('error', (error) => {
    console.error('Stream error:', error);
  });
  
  return stream;
}

// Run the examples
async function runExamples() {
  try {
    // Uncomment one of the examples below
    
    // Example 1: Filtered stream
    // const stream = createFilteredStream(['javascript', 'typescript', 'nodejs']);
    // await stream.start();
    // console.log('Stream started. Press Ctrl+C to stop.');
    
    // Example 2: Sample stream
    // const stream = createSampleStream();
    // await stream.start();
    // console.log('Stream started. Press Ctrl+C to stop.');
    
    // Example 3: User stream
    // const stream = createUserStream(['USER_ID_1', 'USER_ID_2']);
    // await stream.start();
    // console.log('Stream started. Press Ctrl+C to stop.');
    
    // Example 4: Rules-based stream (v2 API)
    // const stream = createRulesStream([
    //   { value: 'javascript', tag: 'JS tweets' },
    //   { value: 'typescript', tag: 'TS tweets' },
    //   { value: 'nodejs', tag: 'Node.js tweets' },
    // ]);
    // await stream.start();
    // console.log('Stream started. Press Ctrl+C to stop.');
    
    // Stop the stream after 5 minutes
    // setTimeout(async () => {
    //   console.log('Stopping stream...');
    //   await stream.stop();
    //   console.log('Stream stopped.');
    //   process.exit(0);
    // }, 5 * 60 * 1000);
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting...');
  process.exit(0);
});

runExamples().catch(console.error); 