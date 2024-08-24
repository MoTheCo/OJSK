const { remote } = require('electron');

function minimize() {
  remote.getCurrentWindow().minimize();
}

function closeWindow() {
  remote.getCurrentWindow().close();
}
const { ipcRenderer } = require('electron');




