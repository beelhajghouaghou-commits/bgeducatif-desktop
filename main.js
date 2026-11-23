const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

const BASE_URL = 'https://www.bgeducatif.men';
const START_URL = 'https://www.bgeducatif.men/?app=exe';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    title: 'BG Éducatif',
    autoHideMenuBar: true,
    webPreferences: {
      partition: 'persist:bgeducatif',
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  Menu.setApplicationMenu(null);
  win.loadURL(START_URL);

  // الروابط الداخلية تبقى داخل البرنامج، والخارجية (واتساب وغيره) تُفتح في المتصفح الافتراضي
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith(BASE_URL)) return { action: 'allow' };
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // صفحة بديلة عند انقطاع الإنترنت
  win.webContents.on('did-fail-load', (e, code, desc, url, isMainFrame) => {
    if (isMainFrame && code !== -3) win.loadFile(path.join(__dirname, 'offline.html'));
  });
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
