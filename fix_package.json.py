import json

# Read the current package.json
with open('package.json', 'r') as f:
    package = json.load(f)

# Add build script if it doesn't exist
if 'scripts' not in package:
    package['scripts'] = {}

if 'build' not in package['scripts']:
    package['scripts']['build'] = 'vite build'

# Write the updated package.json
with open('package.json', 'w') as f:
    json.dump(package, f, indent=2)

print("✅ Added build script to package.json")
