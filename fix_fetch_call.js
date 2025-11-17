const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the old GET call with new POST call
const oldFetchCall = 'const response = await fetch(`${TOKEN_SERVER_URL}/token?channel=${channelName}&uid=${Math.floor(Math.random() * 100000)}`);';

const newFetchCall = `const response = await fetch(\`\${TOKEN_SERVER_URL}/generate-token\`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelName }),
      });`;

content = content.replace(oldFetchCall, newFetchCall);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed fetch call to use POST with JSON body');
