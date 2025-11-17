# Read the file
with open('src/components/VoiceChatRooms.tsx', 'r') as f:
    lines = f.readlines()

# Find and remove duplicate join call sections
in_join_section = False
join_sections = []
current_section = []
section_start = -1

for i, line in enumerate(lines):
    if "const token = await generateToken(roomId);" in line:
        if not in_join_section:
            in_join_section = True
            section_start = i
            current_section = []
        current_section.append((i, line))
    elif in_join_section and "await agoraClientRef.current.join(APP_ID, roomId, token, uid);" in line:
        current_section.append((i, line))
        join_sections.append((section_start, current_section))
        in_join_section = False
        current_section = []

# If we have duplicates, remove extras
if len(join_sections) > 1:
    print(f"Found {len(join_sections)} join call sections")
    # Keep only the first one, remove others
    for start, section in join_sections[1:]:
        for line_num, line_content in section:
            lines[line_num] = ""
    print("✅ Removed duplicate join calls")
    
    # Write the cleaned file
    with open('src/components/VoiceChatRooms.tsx', 'w') as f:
        f.writelines(lines)
else:
    print("✅ No duplicate join calls found")

