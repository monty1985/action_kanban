const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const waitOn = require('wait-on');

let mainWindow;
let backendProcess;

function startBackend() {
  return new Promise((resolve, reject) => {
    // Start the backend server
    backendProcess = spawn('node', [
      path.join(__dirname, '../backend/dist/server.js')
    ], {
      env: { ...process.env, PORT: 13000 },
      cwd: path.join(__dirname, '../backend')
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    // Wait for backend to be ready
    waitOn({
      resources: ['http://localhost:13000/health'],
      timeout: 30000
    }).then(() => {
      console.log('Backend is ready');
      resolve();
    }).catch(reject);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the frontend from file
  mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();
  } catch (error) {
    console.error('Failed to start:', error);
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});