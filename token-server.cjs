const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Use environment variables in production
const APP_ID = process.env.APP_ID || '19383786453e4bae98ee25658adf5a4c';
const APP_CERTIFICATE = process.env.APP_CERTIFICATE || 'ff9793f8225f44108e99491b69708073';

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Token server is running!',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/generate-token', (req, res) => {
  try {
    const { channelName, uid = 0 } = req.body;
    
    if (!channelName) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    console.log(`🔑 Generating RTC token for channel: ${channelName}, uid: ${uid}`);

    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600 * 24;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    console.log(`✅ Generated token for channel: ${channelName}`);
    
    res.json({
      token,
      appId: APP_ID,
      channel: channelName,
      uid: uid
    });

  } catch (error) {
    console.error('❌ Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token: ' + error.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Token server running on port ${PORT}`);
  console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
});
