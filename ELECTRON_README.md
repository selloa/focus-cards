# Focus Cards - Electron App

This is the Electron desktop application version of Focus Cards.

## Prerequisites

1. **Node.js**: Install Node.js (version 16 or higher) from [nodejs.org](https://nodejs.org/)
2. **PowerShell Execution Policy**: You may need to enable script execution in PowerShell

## Setup Instructions

### 1. Enable PowerShell Script Execution (if needed)
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Development
```bash
# Start the app in development mode
npm run dev

# Start the app normally
npm start
```

### 4. Build Executable
```bash
# Build for Windows
npm run build
```

The executable will be created in the `dist` folder.

## Features Added for Desktop

- **Native Window**: Frameless window with custom titlebar
- **Window Dragging**: Click and drag anywhere on the window to move it
- **Global Shortcuts**: 
  - Ctrl+X: Exit application
  - Alt+Enter: Toggle fullscreen
  - F11: Toggle fullscreen (alternative)
  - Ctrl+1: Toggle compact mode (small window, always on top)
  - F5: Refresh page / Change color scheme
  - Ctrl+R: Refresh page / Change color scheme
  - F12: Toggle DevTools (development)
- **Menu Bar**: File, View, and Help menus
- **Security**: Disabled nodeIntegration, enabled contextIsolation
- **External Links**: Opens external links in default browser

## Development Notes

- The app maintains all original web functionality
- Local storage works the same as in the browser
- The watermark link to GitHub will open in the default browser
- Fullscreen mode works with both F11 and the existing F key during startup
- **Compact Mode**: Ctrl+1 creates a small 200x150 resizable window in the lower left corner that stays on top of other windows
- **Window Dragging**: The entire window can be dragged by clicking and holding anywhere on the interface

## Building for Distribution

1. Add an icon file to `assets/icon.ico` (256x256 recommended)
2. Run `npm run build`
3. Find the installer in `dist/` folder

## Troubleshooting

If you get execution policy errors:
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Try the npm commands again

If Electron fails to install:
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules folder and package-lock.json
3. Run `npm install` again
