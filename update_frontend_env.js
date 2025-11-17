const fs = require('fs');
const filePath = 'src/components/VoiceChatRooms.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the TOKEN_SERVER_URL with environment-aware code
const newCode = `const TOKEN_SERVER_URL = import.meta.env.PROD 
  ? 'https://neon-line-token-server.onrender.com'
  : 'http://localhost:3001';`;

content = content.replace(/const TOKEN_SERVER_URL = [^;]*;/, newCode);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Updated frontend to use environment-based URLs');
