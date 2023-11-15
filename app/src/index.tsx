import React from 'react';
import './styles';
import ReactDOM from 'react-dom/client';
import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainLayout from './components/layouts/main-layout';
import RootPage from './pages/root';
import SignInPage from './pages/_auth/sign-in';
import SignUpPage from './pages/_auth/sign-up';
import AuthLayout from './components/layouts/auth-layout';
import {
  AuthProvider,
  IsLoggedIn,
  IsLoggedOut,
  RedirectToSignIn
} from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WebSocketProvider } from './contexts/SocketContext';
import RoomPage from './pages/room';
import { RoomDataProvider } from './contexts/RoomDataContext';
import { CurrentRoomProvider } from './contexts/CurrentRoomContext';

const routes = [
  {
    path: '/sign-in/*',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    )
  },
  {
    path: '/sign-up/*',
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    )
  },
  {
    path: '/',
    element: (
      <>
        <IsLoggedIn>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </IsLoggedIn>
        <IsLoggedOut>
          <RedirectToSignIn />
        </IsLoggedOut>
      </>
    ),
    children: [
      {
        path: '/',
        element: <RootPage />
      },
      {
        path: '/room/:roomId',
        element: <RoomPage />
      },
      {
        path: '/about',
        element: (
          <div className='flex w-full justify-center mt-8 text-3xl'>
            Not much to say.
          </div>
        )
      }
    ]
  }
];

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createHashRouter(routes);

const Providers = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RoomDataProvider>
          <CurrentRoomProvider>
            <WebSocketProvider>
              <RouterProvider router={router} />
            </WebSocketProvider>
          </CurrentRoomProvider>
        </RoomDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <Providers />
  </React.StrictMode>
);
