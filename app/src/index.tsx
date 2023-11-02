import React from 'react';
import RootPage from './pages/root';
import './styles/globals.css';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <RootPage />
  </React.StrictMode>
);
