import './index.css';

// Expose the versions object to the renderer process
declare global {
  interface Window {
    versions: {
      chrome: () => string;
      electron: () => string;
      node: () => string;
      ping: () => Promise<boolean>;
    };
    darkMode: {
      toggle: () => Promise<boolean>;
      system: () => Promise<void>;
    };
  }
}

console.log(
  '👋 This message is being logged by "renderer.js", included via Vite'
);

const information = document.getElementById('info');
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;

const func = async () => {
  const response = await window.versions.ping();
  console.log(response);
};

func();

document
  .getElementById('dark-mode:toggle')
  .addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle();
    document.getElementById('theme-source').innerHTML = isDarkMode
      ? 'Dark'
      : 'Light';
  });

document
  .getElementById('dark-mode:system')
  .addEventListener('click', async () => {
    await window.darkMode.system();
    document.getElementById('theme-source').innerHTML = 'System';
  });
