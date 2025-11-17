import express from 'express';
import { RtcTokenBuilder, RtcRole } from 'agora-token';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Use your actual App ID and Certificate from Agora
const APP_ID = 'ffd19f1b5b8a4f3c8f5e9b5a8d7c6b1b';
const APP_CERTIFICATE = 'ffd19f1b5b8a4f3c8f5e9b5a8d7c6b1b';

app.get('/health', (req, res) => {
  res.json({ status: 'Token server is running!' });
});

app.post('/generate-token', (req, res) => {
  try {
    const { channelName, uid = 0 } = req.body;
    
    if (!channelName) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

    // Token expires in 24 hours
    const expirationTimeInSeconds = 3600 * 24;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    // Build token with admin privileges
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      channelName,
      uid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    console.log(`✅ Generated token for channel: ${channelName}, uid: ${uid}`);
    
    res.json({
      token,
      appId: APP_ID,
      channel: channelName,
      uid: uid
    });

  } catch (error) {
    console.error('❌ Token generation error:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Token server running on http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});
