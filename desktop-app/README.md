# Action Kanban Desktop App

This is the desktop version of Action Kanban for macOS (Apple Silicon).

## Prerequisites

1. Make sure the Docker containers are running:
   ```bash
   cd ..
   ./start.sh
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the app in development mode:
```bash
npm start
```

## Build for macOS

Build the app for Apple Silicon Macs:
```bash
npm run dist
```

This will create:
- `dist/Action Kanban-1.0.0-arm64.dmg` - Installer for Apple Silicon Macs

## Installation

1. Open the .dmg file
2. Drag Action Kanban to your Applications folder
3. Launch from Applications or Spotlight

## Features

- Native macOS app with menu bar integration
- Runs the full Action Kanban application
- Optimized for Apple Silicon (M1/M2/M3)
- Auto-updates support (can be configured)

## Icon

Place your app icon as:
- `assets/icon.icns` (macOS icon file)
- `assets/icon.png` (1024x1024 PNG for other uses)