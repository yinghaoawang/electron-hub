import MainLayout from '../components/layouts/main-layout';

export default function RootPage() {
  return (
    <MainLayout>
      <h1 className='text-3xl font-bold mb-3'>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <p>
        Theme is <strong id='theme-source'>System</strong>
      </p>
      <button id='dark-mode:toggle'>Dark Mode</button>
      <button id='dark-mode:system'>Reset To System</button>
      <p id='info'></p>
    </MainLayout>
  );
}
