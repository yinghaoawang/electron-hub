import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import useFetch from '../hooks/useFetch';

const { VITE_API_URL, VITE_NODE_ENV } = import.meta.env;

export default function RootPage() {
  const { toggleTheme, resetToSystemTheme } = useTheme();
  const fetch = useFetch();
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${VITE_API_URL}`, { method: 'GET' });
      console.log(res);
    };
    fetchData();
  }, []);
  return (
    <div className='flex items-center mt-8 flex-col gap-2 px-4'>
      <h1 className='text-3xl font-bold mb-3'>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <div>NODE_ENV {VITE_NODE_ENV}</div>
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
