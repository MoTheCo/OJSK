const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const ks = require('node-key-sender');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
    frame: true,
    maximizable: false,
    resizable: false,
    alwaysOnTop: true
  });

  win.loadFile('index.html');
  win.setMenu(null);

  // Handle focus events to make window behave as if it's not focusable
  win.on('focus', () => {
    if (process.platform === 'darwin') {
      // Refocus previous window on macOS
      exec('osascript -e \'tell application "System Events" to keystroke tab using command down\'');
    } else {
      // Refocus previous window on Windows
      exec('powershell -command "$wshell = New-Object -ComObject wscript.shell; $wshell.SendKeys(\'%{TAB}\')"');
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handling the IPC event for key press
ipcMain.on('perform-key-press', async (event, arg) => {
  try {
    if (process.platform === 'darwin') {
      await sendTextToActiveAppMac(arg);
    } else if (process.platform === 'win32') {
      await sendTextToActiveAppWindows(arg);
    }
    event.reply('key-press-reply', `Text "${arg}" wurde gesendet.`);
  } catch (error) {
    console.error('Error sending text:', error);
    event.reply('key-press-reply', `Fehler beim Senden des Textes: ${error.message}`);
  }
});

// Handling window move event with optimization to prevent flickering
let lastMoveTime = 0;
const moveInterval = 50; // Time in milliseconds

ipcMain.on('move-window', (event, arg) => {
  const { x, y } = arg;
  const now = Date.now();
  if (now - lastMoveTime > moveInterval) {
    const [currentX, currentY] = win.getPosition();
    win.setPosition(currentX + x, currentY + y);
    lastMoveTime = now;
  }
});

// Handling window close event
ipcMain.on('close-window', () => {
  win.close();
});

// Handling save word event
ipcMain.handle('save-word', async (event, word) => {
  const filePath = path.join(__dirname, 'word.md');
  try {
    // Check if the word already exists
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const words = fileContent.split('\n').map(line => line.trim());

    if (!words.includes(word)) {
      fs.appendFileSync(filePath, `${word}\n`, 'utf8');
    }
    return `Word "${word}" saved successfully.`;
  } catch (err) {
    console.error('Failed to save the word:', err);
    throw err;
  }
});

// Function to send text to the active application using AppleScript on macOS
function sendTextToActiveAppMac(text) {
  return new Promise((resolve, reject) => {
    const script = `
      tell application "System Events"
        keystroke "${text.replace(/"/g, '\\"')}"
      end tell
    `;
    exec(`osascript -e '${script}'`, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// Function to send text to the active application using node-key-sender on Windows
function sendTextToActiveAppWindows(text) {
  return ks.sendText(text);
}
