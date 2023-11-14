import React from 'react';
import './styles';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainLayout from './components/layouts/main-layout';
import RootPage from './pages/root';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from '@clerk/clerk-react';
import SignInPage from './pages/_auth/sign-in';
import SignUpPage from './pages/_auth/sign-up';
import AuthLayout from './components/layouts/auth-layout';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { dark } from '@clerk/themes';
import { WebSocketProvider } from './contexts/SocketContext';
import RoomPage from './pages/room';
import { RoomDataProvider } from './contexts/RoomDataContext';
import { CurrentRoomProvider } from './contexts/CurrentRoomContext';

const { VITE_CLERK_PUBLISHABLE_KEY } = import.meta.env;
if (!VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

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
        <SignedIn>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
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
const router = createBrowserRouter(routes);

const Providers = () => {
  return (
    <ClerkProvider
      key={Math.random()}
      signInUrl='/sign-in'
      signUpUrl='/sign-up'
      appearance={{ baseTheme: dark }}
      publishableKey={VITE_CLERK_PUBLISHABLE_KEY}
    >
      <UserProvider>
        <RoomDataProvider>
          <CurrentRoomProvider>
            <WebSocketProvider>
              <RouterProvider router={router} />
            </WebSocketProvider>
          </CurrentRoomProvider>
        </RoomDataProvider>
      </UserProvider>
    </ClerkProvider>
  );
};

root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Providers />
    </ThemeProvider>
  </React.StrictMode>
);
