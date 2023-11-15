// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Vite
// plugin that tells the Electron app where to look for the Vite-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

type Theme = 'dark' | 'light';

// Expose the versions object to the renderer process
interface Window {
  versions: {
    chrome: () => string;
    electron: () => string;
    node: () => string;
    ping: () => Promise<boolean>;
  };
  darkMode: {
    get: () => Promise<boolean>;
    toggle: () => Promise<boolean>;
    reset: () => Promise<boolean>;
  };
  notifications: {
    send: (title: string, body: string) => void;
  };
}
