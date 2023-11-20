import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DetailedUser,
  LoginAPIBody,
  LoginAPIResData,
  MeAPIResData,
  SignupAPIBody,
  SignupAPIResData
} from '../../../shared/shared-types';
import { sendNotification } from '../_lib/notifications';

const { VITE_API_URL } = import.meta.env;

type AuthContent = {
  isLoggedIn: () => boolean;
  isLoading: boolean;
  authUser: DetailedUser | null;
  authToken: string | null;
  logIn: (
    email: string,
    password: string,
    onSuccess?: () => unknown,
    onError?: () => unknown
  ) => Promise<void>;
  signUp: (
    displayName: string,
    email: string,
    password: string,
    onSuccess?: () => unknown,
    onError?: () => unknown
  ) => Promise<void>;
  logOut?: () => void;
};

export const AuthContext = createContext<AuthContent>(null);

const parseFirebaseErrorCode = (code: string) => {
  if (code === 'auth/invalid-email') {
    return 'Invalid email';
  }
  if (code === 'auth/invalid-login-credentials') {
    return 'Invalid credentials';
  }

  console.log(`Unhandled error code: ${code}`);

  if (code.startsWith('auth/')) {
    let parsed = code.replace('auth/', '').replace(/-/g, ' ');
    parsed = parsed.charAt(0).toUpperCase() + parsed.slice(1);
    return parsed;
  }
  return null;
};

const getAuthErrorMessage = (error: any) => {
  return (
    error.message ||
    (error?.code && parseFirebaseErrorCode(error.code)) ||
    'Something went wrong'
  );
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<DetailedUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const isLoggedIn = () => authUser != null;
  const fetchAuthToken = () => {
    if (localStorage.getItem('authToken')) {
      setAuthToken(localStorage.getItem('authToken'));
      return localStorage.getItem('authToken');
    }
    return authToken;
  };
  const storeAuthToken = (token: string) => {
    localStorage.setItem('authToken', token);
    setAuthToken(token);
  };

  const logOut = async () => {
    try {
      const res = await fetch(`${VITE_API_URL}/logout`, {
        headers: {
          Authorization: `Bearer ${fetchAuthToken()}`
        },
        method: 'POST'
      });
      if (!res.ok) {
        const { error } = await res.json();
        sendNotification('Logout failed', getAuthErrorMessage(error), 'error');
      } else {
        setAuthUser(null);
        storeAuthToken(null);
        sendNotification('Logout successful', 'You have been logged out', 'ok');
      }
    } catch (error) {
      sendNotification('Logout failed', getAuthErrorMessage(error), 'error');
    }
  };

  const logIn = async (
    email: string,
    password: string,
    onSuccess?: () => unknown,
    onError?: () => unknown
  ) => {
    try {
      const body: LoginAPIBody = { email, password };
      const res = await fetch(`${VITE_API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const { error } = await res.json();
        sendNotification('Login failed', getAuthErrorMessage(error), 'error');
        if (onError) onError();
      } else {
        const parsedRes: LoginAPIResData = await res.json();
        setAuthUser(parsedRes.user);
        storeAuthToken(parsedRes.token);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      sendNotification('Login failed', getAuthErrorMessage(error), 'error');
      if (onError) onError();
    }
  };

  const signUp = async (
    displayName: string,
    email: string,
    password: string,
    onSuccess?: () => unknown,
    onError?: () => unknown
  ) => {
    try {
      const body: SignupAPIBody = { displayName, email, password };
      const res = await fetch(`${VITE_API_URL}/signup`, {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const { error } = await res.json();
        sendNotification('Signup failed', getAuthErrorMessage(error), 'error');
        if (onError) onError();
      } else {
        const parsedRes: SignupAPIResData = await res.json();
        setAuthUser(parsedRes.user);
        storeAuthToken(parsedRes.token);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      sendNotification('Signup failed', getAuthErrorMessage(error), 'error');
      if (onError) onError();
    }
  };

  useEffect(() => {
    const fetchAuthUser = async () => {
      setIsLoading(true);
      let user = null;
      try {
        const res = await fetch(`${VITE_API_URL}/me`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${fetchAuthToken()}`
          }
        });
        if (res.ok) {
          const parsedRes: MeAPIResData = await res.json();
          user = parsedRes.user;
        }
      } catch (error) {
        console.error(error);
      }
      setAuthUser(user);
      setIsLoading(false);
      return user;
    };

    fetchAuthUser();
  }, []);

  const value = {
    isLoggedIn,
    isLoading,
    authUser,
    authToken,
    logIn,
    signUp,
    logOut
  };

  if (isLoading) return <></>;

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
