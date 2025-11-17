const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// The correct generateToken function
const correctFunction = `const generateToken = async (channelName: string): Promise<string> => {
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

// Find the current function and replace it
const functionStart = content.indexOf('const generateToken = async');
if (functionStart !== -1) {
  // Find the end of the function (look for the closing brace and semicolon)
  let braceCount = 0;
  let functionEnd = functionStart;
  let inFunction = false;
  
  for (let i = functionStart; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      inFunction = true;
    } else if (content[i] === '}') {
      braceCount--;
      if (inFunction && braceCount === 0) {
        functionEnd = i + 1;
        break;
      }
    }
  }
  
  // Replace the function
  const newContent = content.substring(0, functionStart) + correctFunction + content.substring(functionEnd);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log('✅ Successfully replaced the generateToken function');
} else {
  console.log('❌ Could not find generateToken function');
}
