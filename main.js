const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 100,
    minHeight: 100,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: true
    },
    icon: path.join(__dirname, 'assets/icon.ico'),
    show: false, // Don't show until ready
    titleBarStyle: 'hidden',
    frame: false,
    fullscreenable: true,
    resizable: true,
    backgroundColor: '#ffffff'
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Inject CSS and JS for window dragging
    injectWindowDragging();
    
    // Optional: Open DevTools in development
    if (process.argv.includes('--dev')) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Register global shortcuts
  registerGlobalShortcuts();
}

function registerGlobalShortcuts() {
  // Register Ctrl+X for exit
  globalShortcut.register('CommandOrControl+X', () => {
    app.quit();
  });

  // Register Alt+Enter for fullscreen toggle
  globalShortcut.register('Alt+Enter', () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  // Register F11 for fullscreen toggle (keep existing)
  globalShortcut.register('F11', () => {
    if (mainWindow) {
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
  });

  // Register F5 for page refresh/color scheme change
  globalShortcut.register('F5', () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  // Register Ctrl+R for page refresh/color scheme change
  globalShortcut.register('CommandOrControl+R', () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  // Register Ctrl+1 for smallest window size
  globalShortcut.register('CommandOrControl+1', () => {
    if (mainWindow) {
      mainWindow.setSize(160, 80);
      mainWindow.center();
    }
  });

  // Register Ctrl+2 for medium window size
  globalShortcut.register('CommandOrControl+2', () => {
    if (mainWindow) {
      mainWindow.setSize(200, 100);
      mainWindow.center();
    }
  });

  // Register Ctrl+3 for larger window size
  globalShortcut.register('CommandOrControl+3', () => {
    if (mainWindow) {
      mainWindow.setSize(300, 150);
      mainWindow.center();
    }
  });

  // Register Ctrl+4 for extra large window size
  globalShortcut.register('CommandOrControl+4', () => {
    if (mainWindow) {
      mainWindow.setSize(400, 200);
      mainWindow.center();
    }
  });

  // Register Ctrl+5 for huge window size
  globalShortcut.register('CommandOrControl+5', () => {
    if (mainWindow) {
      mainWindow.setSize(500, 250);
      mainWindow.center();
    }
  });

  // Register Ctrl+6 for massive window size
  globalShortcut.register('CommandOrControl+6', () => {
    if (mainWindow) {
      mainWindow.setSize(600, 300);
      mainWindow.center();
    }
  });

  // Register Ctrl+7 for enormous window size
  globalShortcut.register('CommandOrControl+7', () => {
    if (mainWindow) {
      mainWindow.setSize(700, 350);
      mainWindow.center();
    }
  });

  // Register Ctrl+8 for gigantic window size
  globalShortcut.register('CommandOrControl+8', () => {
    if (mainWindow) {
      mainWindow.setSize(800, 400);
      mainWindow.center();
    }
  });

  // Register Ctrl+9 for maximum window size
  globalShortcut.register('CommandOrControl+9', () => {
    if (mainWindow) {
      mainWindow.setSize(900, 450);
      mainWindow.center();
    }
  });

  // Register Ctrl+T for Stay on Top toggle
  globalShortcut.register('CommandOrControl+T', () => {
    if (mainWindow) {
      const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
      mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
    }
  });

  // Register Ctrl+Shift+I for DevTools (development only)
  if (process.argv.includes('--dev')) {
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      if (mainWindow) {
        mainWindow.webContents.toggleDevTools();
      }
    });
  }
}

function injectWindowDragging() {
  // Inject CSS for window dragging
  mainWindow.webContents.insertCSS(`
    body {
      -webkit-app-region: drag;
      user-select: none;
    }
    
    /* Make interactive elements non-draggable */
    input, button, a, [contenteditable], .watermark {
      -webkit-app-region: no-drag;
      user-select: text;
    }
    
    /* Ensure text can be selected in input fields */
    input {
      user-select: text;
      -webkit-user-select: text;
    }
  `);
}

// Create menu template
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Session',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('new-session');
            }
          }
        },
        {
          label: 'Clear All Data',
          accelerator: 'CmdOrCtrl+Shift+Delete',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('clear-data');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Refresh / Change Colors',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) {
              mainWindow.reload();
            }
          }
        },
        {
          label: 'Toggle Fullscreen',
          accelerator: 'Alt+Enter',
          click: () => {
            if (mainWindow) {
              mainWindow.setFullScreen(!mainWindow.isFullScreen());
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Window Size - Small',
          accelerator: 'CmdOrCtrl+1',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(160, 80);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Medium',
          accelerator: 'CmdOrCtrl+2',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(200, 100);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Large',
          accelerator: 'CmdOrCtrl+3',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(300, 150);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Extra Large',
          accelerator: 'CmdOrCtrl+4',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(400, 200);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Huge',
          accelerator: 'CmdOrCtrl+5',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(500, 250);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Massive',
          accelerator: 'CmdOrCtrl+6',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(600, 300);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Enormous',
          accelerator: 'CmdOrCtrl+7',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(700, 350);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Gigantic',
          accelerator: 'CmdOrCtrl+8',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(800, 400);
              mainWindow.center();
            }
          }
        },
        {
          label: 'Window Size - Maximum',
          accelerator: 'CmdOrCtrl+9',
          click: () => {
            if (mainWindow) {
              mainWindow.setSize(900, 450);
              mainWindow.center();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Toggle Stay on Top',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            if (mainWindow) {
              const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
              mainWindow.setAlwaysOnTop(!isAlwaysOnTop);
            }
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.toggleDevTools();
            }
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Focus Cards',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('show-about');
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    // Open external links in default browser
    require('electron').shell.openExternal(navigationUrl);
  });
});