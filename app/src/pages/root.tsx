export default function RootPage() {
  return (
    <>
      <h1>💖 Hello World!</h1>
      <p>Welcome to your Electron application.</p>
      <p>
        Theme is <strong id='theme-source'>System</strong>
      </p>
      <button id='dark-mode:toggle'>Dark Mode</button>
      <button id='dark-mode:system'>Reset To System</button>
      <p id='info'></p>
    </>
  );
}
