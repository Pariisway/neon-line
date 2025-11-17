const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the entire generateToken function
const oldFunction = /const generateToken = async[^{]*{[\s\S]*?await fetch[^}]*}/;

const newFunction = `const generateToken = async (channelName: string): Promise<string> => {
    try {
      const response = await fetch(\`\${TOKEN_SERVER_URL}/generate-token\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelName }),
      });

      if (!response.ok) {
        throw new Error(\`Token server error: \${response.status}\`);
      }

      const data = await response.json();
      console.log('✅ Token generated:', data.token);
      return data.token;
    } catch (error) {
      console.error('❌ Token generation failed:', error);
      throw new Error('Failed to generate token. Make sure token server is running.');
    }
  }`;

content = content.replace(oldFunction, newFunction);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Completely replaced generateToken function');
