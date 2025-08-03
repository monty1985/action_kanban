#!/bin/bash

echo "Building Action Kanban Desktop App for macOS..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create assets directory
mkdir -p assets

# Create a simple icon if it doesn't exist
if [ ! -f "assets/icon.png" ]; then
    echo "${BLUE}Creating default icon...${NC}"
    # Create a simple colored square as placeholder icon
    convert -size 1024x1024 xc:'#00ff88' assets/icon.png 2>/dev/null || {
        echo "Note: Install ImageMagick to generate icon automatically"
        echo "Please add your own icon.png (1024x1024) to assets/"
    }
fi

# Convert PNG to ICNS for macOS
if [ -f "assets/icon.png" ] && [ ! -f "assets/icon.icns" ]; then
    echo "${BLUE}Converting icon to .icns format...${NC}"
    mkdir -p assets/icon.iconset
    sips -z 1024 1024 assets/icon.png --out assets/icon.iconset/icon_512x512@2x.png
    sips -z 512 512 assets/icon.png --out assets/icon.iconset/icon_512x512.png
    sips -z 512 512 assets/icon.png --out assets/icon.iconset/icon_256x256@2x.png
    sips -z 256 256 assets/icon.png --out assets/icon.iconset/icon_256x256.png
    sips -z 256 256 assets/icon.png --out assets/icon.iconset/icon_128x128@2x.png
    sips -z 128 128 assets/icon.png --out assets/icon.iconset/icon_128x128.png
    iconutil -c icns assets/icon.iconset
    rm -rf assets/icon.iconset
fi

# Install dependencies
echo "${BLUE}Installing dependencies...${NC}"
npm install

# Build the desktop app
echo "${BLUE}Building macOS app for Apple Silicon...${NC}"
npm run dist

echo "${GREEN}✅ Build complete!${NC}"
echo "Find your app in: ./dist/Action Kanban-1.0.0-arm64.dmg"
echo ""
echo "To install:"
echo "1. Open the .dmg file"
echo "2. Drag Action Kanban to Applications"
echo "3. Launch from Applications or Spotlight"