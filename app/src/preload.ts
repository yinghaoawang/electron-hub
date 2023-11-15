import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
});

contextBridge.exposeInMainWorld('darkMode', {
  get: () => ipcRenderer.invoke('dark-mode:get'),
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  reset: () => ipcRenderer.invoke('dark-mode:reset')
});

contextBridge.exposeInMainWorld('notifications', {
  send: (title: string, body: string) => {
    ipcRenderer.invoke('notifications:send', title, body);
  }
});
