import re

with open('src/components/VoiceChatRooms.tsx', 'r') as f:
    content = f.read()

# The exact line we need to replace
old_line = '      const response = await fetch(`${TOKEN_SERVER_URL}/token?channel=${channelName}&uid=${Math.floor(Math.random() * 100000)}`);'

new_code = '''      const response = await fetch(`${TOKEN_SERVER_URL}/generate-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ channelName }),
      });'''

if old_line in content:
    content = content.replace(old_line, new_code)
    with open('src/components/VoiceChatRooms.tsx', 'w') as f:
        f.write(content)
    print("✅ Successfully replaced the fetch call!")
else:
    print("❌ Could not find the exact line to replace")
    print("Looking for similar lines...")
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'TOKEN_SERVER_URL' in line and 'fetch' in line:
            print(f"Line {i+1}: {line}")
