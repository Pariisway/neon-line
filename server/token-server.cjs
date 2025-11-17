const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-token');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// CORRECT CREDENTIALS FROM YOUR AGORA PROJECT
const APP_ID = '19383786453e4bae98ee25658adf5a4c';
const APP_CERTIFICATE = 'ff9793f8225f44108e99491b69708073';

app.get('/health', (req, res) => {
  res.json({ status: 'Token server is running!' });
});

app.post('/generate-token', (req, res) => {
  try {
    const { channelName, uid = 0 } = req.body;
    
    if (!channelName) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    console.log(`🔑 Generating RTC token for channel: ${channelName}, uid: ${uid}`);

    // Token configuration for VOICE CHAT
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600 * 24;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Generate RTC token with CORRECT certificate
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE, // USING CORRECT CERTIFICATE NOW
      channelName,
      uid,
      role,
      privilegeExpiredTs
    );

    console.log(`✅ Generated VALID RTC token with CORRECT certificate`);
    console.log(`   App ID: ${APP_ID}`);
    console.log(`   Channel: ${channelName}`);
    console.log(`   UID: ${uid}`);
    
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
  console.log(`🚀 Token server running on http://localhost:${PORT}`);
  console.log(`✅ Using CORRECT App ID: ${APP_ID}`);
  console.log(`✅ Using CORRECT Certificate: ${APP_CERTIFICATE}`);
  console.log(`🎯 This will generate VALID tokens for voice chat!`);
});
