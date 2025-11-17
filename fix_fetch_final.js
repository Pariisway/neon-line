const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the fetch call with POST method and JSON body
const oldFetchLine = `const response = await fetch(\\`\\${TOKEN_SERVER_URL}/generate-token?channel=\\$\\{channelName\\}&uid=\\$\\{Math.floor(Math.random() * 100000)\\}\\`);`;

const newFetchCode = `const response = await fetch(\\`\\${TOKEN_SERVER_URL}/generate-token\\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channelName }),
    });`;

content = content.replace(oldFetchLine, newFetchCode);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed fetch call to use POST with JSON body');
