import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeTheme,
  Notification,
  Tray,
  nativeImage
} from 'electron';
import path from 'path';
import { updateElectronApp } from 'update-electron-app';

let isQuitting = false;

if (process.platform === 'win32') {
  app.setAppUserModelId('Hub');
}

updateElectronApp();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Prevent close unless with tray
  mainWindow.on('close', function (event) {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }

    return false;
  });

  // Set icon paths
  const isProduction = MAIN_WINDOW_VITE_DEV_SERVER_URL == null;
  const assetsPath = isProduction
    ? path.join(__dirname, '_assets')
    : path.join(__dirname, '../../src/_assets');

  const windowIconPath = path.join(assetsPath, 'window-icon.png');
  const trayIconPath = path.join(assetsPath, 'tray-icon.png');

  // Set window icon
  mainWindow.setIcon(windowIconPath);

  // Create tray & context menu
  const tray = new Tray(nativeImage.createFromPath(trayIconPath));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Hub', enabled: false },
    {
      label: 'Show',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Hub');
  tray.setContextMenu(contextMenu);
  tray.on('right-click', () => {
    tray.popUpContextMenu();
  });
  tray.on('click', () => {
    mainWindow.show();
  });

  // Open the DevTools.
  if (!isProduction) {
    mainWindow.webContents.openDevTools();
  }
};

// Handles for closing the app for macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong');

  ipcMain.handle('dark-mode:get', () => nativeTheme.shouldUseDarkColors);

  ipcMain.handle('dark-mode:toggle', () => {
    if (nativeTheme.shouldUseDarkColors) {
      nativeTheme.themeSource = 'light';
    } else {
      nativeTheme.themeSource = 'dark';
    }
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('dark-mode:reset', () => {
    nativeTheme.themeSource = 'system';
    return nativeTheme.shouldUseDarkColors;
  });

  ipcMain.handle('notifications:send', (_, title, body) => {
    const notification = new Notification({ title, body });
    notification.silent = true;
    notification.show();
  });

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
