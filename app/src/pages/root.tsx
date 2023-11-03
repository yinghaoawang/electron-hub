import { useTheme } from '../contexts/ThemeContext';

export default function RootPage() {
  const { toggleTheme, resetToSystemTheme } = useTheme();
  return (
    <div className='flex items-center mt-8 flex-col gap-2'>
      <h1 className='text-3xl font-bold mb-3'>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <div>NODE_ENV {import.meta.env.VITE_NODE_ENV}</div>
      <div>
        <button className='button' onClick={() => toggleTheme()}>
          Toggle Light/Dark Mode
        </button>
      </div>
      <div>
        <button className='button' onClick={() => resetToSystemTheme()}>
          Reset To System Theme
        </button>
      </div>
      <p id='info'></p>
    </div>
  );
}
