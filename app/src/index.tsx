import React from 'react';
import './styles';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MainLayout from './components/layouts/main-layout';
import RootPage from './pages/root';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import SignInPage from './pages/_auth/sign-in';
import RedirectToSignIn from './components/auth/redirect-to-sign-in';
import SignUpPage from './pages/_auth/sign-up';
import AuthLayout from './components/layouts/auth-layout';
import { UserProvider } from './contexts/UserContext';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error('Missing Publishable Key');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
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
]);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </ClerkProvider>
  </React.StrictMode>
);
