const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  performKeyPress: (text) => ipcRenderer.send('perform-key-press', text),
  moveWindow: (x, y) => ipcRenderer.send('move-window', { x, y }),
  closeWindow: () => ipcRenderer.send('close-window'),
  saveWord: async (word) => ipcRenderer.invoke('save-word', word)
});
