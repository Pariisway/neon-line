const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';

// Read the file
let content = fs.readFileSync(filePath, 'utf8');

// Fix 1: Clean up the TOKEN_SERVER_URL line
content = content.replace(/.*TOKEN_SERVER_URL[^;]*;/g, 'const TOKEN_SERVER_URL = "http://localhost:3001";');

// Fix 2: Clean up the fetch call in generateToken function
content = content.replace(
  /const response = await fetch\\([^)]+\\);/, 
  'const response = await fetch(`${TOKEN_SERVER_URL}/generate-token`, {'
);

// Fix 3: Make sure the fetch call has proper closing
if (!content.includes('method: "POST"')) {
  // If the fetch call is broken, replace the entire generateToken function
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
  };`;
  
  // Replace the old function
  content = content.replace(
    /const generateToken = async[^{]*{[\s\S]*?await fetch[^}]*}/,
    newFunction
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed VoiceChatRooms.tsx completely');
