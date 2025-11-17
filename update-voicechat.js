const fs = require('fs');

const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace all instances of port 3001 with 3002
content = content.replace(/localhost:3001/g, 'localhost:3002');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated VoiceChatRooms to use port 3002');
