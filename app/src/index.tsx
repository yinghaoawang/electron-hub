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
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { dark } from '@clerk/themes';
import { WebSocketProvider } from './contexts/SocketContext';

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
  const { theme } = useTheme();
  let baseTheme;
  if (theme == null || theme == 'dark') {
    baseTheme = dark;
  }

  return (
    <ClerkProvider
      key={Math.random()}
      signInUrl='/sign-in'
      signUpUrl='/sign-up'
      appearance={{ baseTheme }}
      publishableKey={VITE_CLERK_PUBLISHABLE_KEY}
    >
      <UserProvider>
        <WebSocketProvider>
          <RouterProvider router={router} />
        </WebSocketProvider>
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
