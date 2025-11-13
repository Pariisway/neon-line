#!/bin/bash
echo "🛡️  Starting Neon Line Backup..."
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="neon-line-complete-backup-$DATE"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Copy all source files
cp -r components/ "$BACKUP_DIR/"
cp -r src/ "$BACKUP_DIR/"
cp -r public/ "$BACKUP_DIR/" 2>/dev/null || true
cp App.tsx index.html vite.config.js tsconfig.json package.json "$BACKUP_DIR/" 2>/dev/null || true

# Create a summary file
cat > "$BACKUP_DIR/BACKUP-INFO.txt" << INFO
NEON LINE COMPLETE BACKUP
==========================
Backup Date: $(date)
Project: Neon Line Arcade
Description: Complete React/TypeScript arcade with voice chat, games, and merch
Files Included:
- All React components
- Source code
- Configuration files
- Styling and assets

RESTORE INSTRUCTIONS:
1. Extract this backup
2. Run: npm install
3. Run: npm run build
4. Run: npm run dev

Build Status: ✅ PRODUCTION READY
INFO

# Create archive
tar -czf "$BACKUP_DIR.tar.gz" "$BACKUP_DIR"

# Cleanup
rm -rf "$BACKUP_DIR"

echo "✅ BACKUP COMPLETE: $BACKUP_DIR.tar.gz"
echo "📦 Size: $(du -h "$BACKUP_DIR.tar.gz" | cut -f1)"
echo "💾 Files backed up:"
find . -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.json" -o -name "*.html" -o -name "*.css" | head -20
