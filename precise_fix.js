const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Find and replace the exact fetch line
const lines = content.split('\n');
let newLines = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const response = await fetch') && lines[i].includes('generate-token?channel=')) {
    // Replace this line with the correct POST request
    newLines.push('      const response = await fetch(`${TOKEN_SERVER_URL}/generate-token`, {');
    newLines.push('        method: "POST",');
    newLines.push('        headers: {');
    newLines.push('          "Content-Type": "application/json",');
    newLines.push('        },');
    newLines.push('        body: JSON.stringify({ channelName }),');
    newLines.push('      });');
  } else {
    newLines.push(lines[i]);
  }
}

fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
console.log('✅ Successfully fixed the fetch call to use POST with JSON body');
