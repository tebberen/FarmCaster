
try {
  const sdk = require('@farcaster/frame-sdk');
  if (sdk.frameConnector) {
    console.log('frameConnector exists in @farcaster/frame-sdk');
  } else {
    console.log('frameConnector does NOT exist in @farcaster/frame-sdk');
    console.log('Exports:', Object.keys(sdk));
  }
} catch (e) {
  console.error(e);
}
