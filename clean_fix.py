# Read the file
with open('src/components/VoiceChatRooms.tsx', 'r') as f:
    content = f.read()

# Remove duplicate generateToken functions
# Keep only the first occurrence
import re

# Find all generateToken functions
token_functions = list(re.finditer(r'const generateToken = async \(channelName: string\): Promise<string> => \{.*?\n\};\n', content, re.DOTALL))

if len(token_functions) > 1:
    # Keep only the first one
    first_func = token_functions[0]
    for dup in token_functions[1:]:
        content = content.replace(dup.group(0), '')
    print(f"✅ Removed {len(token_functions) - 1} duplicate generateToken functions")

# Ensure the join call uses token generation
if '// Open chat: join without token' in content and 'await agoraClientRef.current.join(APP_ID, roomId, null, uid);' in content:
    content = content.replace(
        '// Open chat: join without token\n      await agoraClientRef.current.join(APP_ID, roomId, null, uid);',
        '// Generate token and join\n      const token = await generateToken(roomId);\n      await agoraClientRef.current.join(APP_ID, roomId, token, uid);'
    )
    print("✅ Updated join call to use token generation")

# Write the cleaned file
with open('src/components/VoiceChatRooms.tsx', 'w') as f:
    f.write(content)

print("✅ File cleaned and updated successfully!")
