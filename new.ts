console.log('Hello');
console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
console.log(
  'Private Key:',
  process.env.FIREBASE_PRIVATE_KEY ? 'Loaded' : 'Missing',
);
