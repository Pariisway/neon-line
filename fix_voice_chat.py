# Read the file
with open('src/components/VoiceChatRooms.tsx', 'r') as f:
    lines = f.readlines()

# Find the main joinVoiceChat function (starts around line 35)
in_join_function = False
join_start_index = -1
join_call_index = -1

for i, line in enumerate(lines):
    if 'const joinVoiceChat = async (roomId: string) => {' in line and i < 100:  # Main function is early in file
        join_start_index = i
        in_join_function = True
    elif in_join_function and 'await agoraClientRef.current.join(APP_ID, roomId, null, uid);' in line:
        join_call_index = i
        break

if join_start_index != -1 and join_call_index != -1:
    # Add generateToken function before joinVoiceChat
    generate_token_function = [
        'const generateToken = async (channelName: string): Promise<string> => {\\n',
        '  try {\\n',
        '    const response = await fetch(\\'https://neon-line-token-server.onrender.com/generate-token\\', {\\n',
        '      method: \\'POST\\',\\n',
        '      headers: {\\n',
        '        \\'Content-Type\\': \\'application/json\\',\\n',
        '      },\\n',
        '      body: JSON.stringify({ channelName })\\n',
        '    });\\n',
        '    \\n',
        '    if (!response.ok) {\\n',
        '      throw new Error(`Token server error: ${response.status}`);\\n',
        '    }\\n',
        '    \\n',
        '    const data = await response.json();\\n',
        '    return data.token;\\n',
        '  } catch (error) {\\n',
        '    console.error(\\'Error generating token:\\', error);\\n',
        '    throw new Error(\\'Failed to get voice chat token. Please try again.\\');\\n',
        '  }\\n',
        '};\\n',
        '\\n'
    ]
    
    # Insert generateToken function
    lines[join_start_index:join_start_index] = generate_token_function
    
    # Update the join call (adjust index since we added lines)
    adjusted_join_call_index = join_call_index + len(generate_token_function)
    if '// Open chat: join without token' in lines[adjusted_join_call_index - 1]:
        lines[adjusted_join_call_index - 1] = '      // Generate token and join\\n'
        lines[adjusted_join_call_index] = '      const token = await generateToken(roomId);\\n'
        lines.insert(adjusted_join_call_index + 1, '      await agoraClientRef.current.join(APP_ID, roomId, token, uid);\\n')
    
    # Write the updated file
    with open('src/components/VoiceChatRooms.tsx', 'w') as f:
        f.writelines(lines)
    
    print("✅ Successfully updated VoiceChatRooms.tsx with token generation!")
else:
    print("❌ Could not locate the join function and call")
