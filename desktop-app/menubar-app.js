const { app, Tray, BrowserWindow, Menu } = require('electron');
const path = require('path');

let tray = null;
let window = null;

app.whenReady().then(() => {
  // Create tray icon
  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon.png'));
  
  // Create window
  window = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    frame: false,
    resizable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  window.loadURL('http://localhost:15173');

  // Toggle window on tray icon click
  tray.on('click', () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      showWindow();
    }
  });

  // Tray menu
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => showWindow() },
    { label: 'Hide App', click: () => window.hide() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Action Kanban');
});

function showWindow() {
  const trayBounds = tray.getBounds();
  const windowBounds = window.getBounds();
  
  // Center window under tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
  const y = Math.round(trayBounds.y + trayBounds.height + 4);
  
  window.setPosition(x, y);
  window.show();
}

// Don't quit when window is closed
app.on('window-all-closed', (e) => {
  e.preventDefault();
});