const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webSecurity: false  // 기본 단축키 오버라이드를 위해 추가
    },
    resizable: true,
    minWidth: 800,
    minHeight: 600
  });

  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools();

  // 기본 메뉴를 완전히 교체하여 기본 단축키 동작 방지
  const menuTemplate = [
    {
      label: '파일',
      submenu: [
        {
          label: '검색',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            mainWindow.webContents.send('shortcut-search');
          }
        },
        {
          label: '초기화',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.webContents.send('shortcut-reset');
          }
        },
        { type: 'separator' },
        {
          label: '종료',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: '개발',
      submenu: [
        {
          label: '개발자 도구',
          accelerator: 'F12',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // 기본 단축키 동작 방지
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Mac에서는 meta(코맨드)키, Windows/Linux에서는 control키
    const isModifierPressed = process.platform === 'darwin' ? input.meta : input.control;
    
    if (isModifierPressed && input.key.toLowerCase() === 'f') {
      event.preventDefault();
      mainWindow.webContents.send('shortcut-search');
    }
    if (isModifierPressed && input.key.toLowerCase() === 'r') {
      event.preventDefault();
      mainWindow.webContents.send('shortcut-reset');
    }
    // Cmd+Q (Ctrl+Q) 종료 단축키
    if (isModifierPressed && input.key.toLowerCase() === 'q') {
      event.preventDefault();
      app.quit();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // 전역 단축키 등록
  const quitAccelerator = process.platform === 'darwin' ? 'Command+Q' : 'Control+Q';
  globalShortcut.register(quitAccelerator, () => {
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // 전역 단축키 해제
  globalShortcut.unregisterAll();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});