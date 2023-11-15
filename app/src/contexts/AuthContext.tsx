import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailedUser } from '../../../shared/shared-types';
import { sendNotification } from '../_lib/notifications';

const { VITE_API_URL } = import.meta.env;

type AuthContent = {
  isLoggedIn: () => boolean;
  isLoading: boolean;
  authUser: DetailedUser | null;
  getAuthToken: () => string | null;
  login: (email: string, password: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContent>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const isLoggedIn = () => authUser != null;
  const getAuthToken = () => authToken;
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${VITE_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const { error } = await res.json();
        let errorMessage = error.message || 'Something went wrong';
        if (error.code === 'auth/invalid-login-credentials') {
          errorMessage = 'Invalid credentials';
        } else {
          console.log(`Unhandled error code: ${error.code}`);
        }
        sendNotification('Login failed', errorMessage);
      } else {
        console.log('logged in', res);
      }
    } catch (err) {
      console.error('caught error in sign in', err);
    }
  };

  const value = { isLoggedIn, isLoading, authUser, getAuthToken, login };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function IsLoggedIn({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? children : <></>;
}

export function IsLoggedOut({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn() ? children : <></>;
}

export function RedirectToSignIn() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/sign-in');
  }, []);
  return <></>;
}

export function useAuth() {
  return useContext(AuthContext);
}
