'use strict';

import { app, protocol, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import { autoUpdater } from 'electron-updater';

const isDevelopment = process.env.NODE_ENV !== 'production';

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    icon: '../public/logo.ico',
    title: 'Style POS',
    webPreferences: {
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  });

  if (isDevelopment) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      alert('Vue Devtools failed to install: ' + e.toString());
    }
  }

  // Configure auto-updater to check for updates from GitHub
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'Bright-Phiri',
    repo: 'StylePos-Frontend',
    releaseType: 'release'
  });

  // Check for updates
  if (!isDevelopment) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

// Listen for update events
autoUpdater.on('checking-for-update', () => {
  alert('Checking for update...');
});

autoUpdater.on('update-available', (info) => {
  alert('Update available: ' + JSON.stringify(info));
});

autoUpdater.on('update-not-available', () => {
  alert('Update not available.');
});

autoUpdater.on('error', (err) => {
  alert('Error in auto-updater: ' + err.toString());
});

autoUpdater.on('download-progress', (progressObj) => {
  alert('Download progress: ' + JSON.stringify(progressObj));
});

autoUpdater.on('update-downloaded', () => {
  alert('Update downloaded; will install now');
  // Quit and install the update
  autoUpdater.quitAndInstall();
});
