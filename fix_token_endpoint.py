import re

# Read the original file
with open('src/components/VoiceChatRooms.tsx', 'r') as f:
    content = f.read()

# Update the endpoint from /token to /generate-token
content = content.replace(
    "fetch('https://neon-line-token-server.onrender.com/token'",
    "fetch('https://neon-line-token-server.onrender.com/generate-token'"
)

# Write the updated content
with open('src/components/VoiceChatRooms.tsx', 'w') as f:
    f.write(content)

print("✅ Endpoint updated from /token to /generate-token")
