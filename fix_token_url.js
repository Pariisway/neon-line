const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Fix the messed up TOKEN_SERVER_URL line
content = content.replace(/.*TOKEN_SERVER_URL.*/g, 'const TOKEN_SERVER_URL = "http://localhost:3001";');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed TOKEN_SERVER_URL');
