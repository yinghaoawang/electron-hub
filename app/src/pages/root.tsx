import MainLayout from '../components/layouts/main-layout';

export default function RootPage() {
  return (
    <MainLayout className='flex flex-col gap-2'>
      <h1 className='text-3xl font-bold mb-3'>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <div>
        <button
          className='button'
          id='dark-mode:toggle'
          onClick={async () => {
            await window.darkMode.toggle();
          }}
        >
          Toggle Light/Dark Mode
        </button>
      </div>
      <div>
        <button
          className='button'
          id='dark-mode:system'
          onClick={async () => {
            await window.darkMode.system();
          }}
        >
          Reset To System Theme
        </button>
      </div>
      <p id='info'></p>
    </MainLayout>
  );
}
