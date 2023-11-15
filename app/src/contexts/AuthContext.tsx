import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailedUser } from '../../../shared/shared-types';

type AuthContent = {
  isLoggedIn: () => boolean;
  isLoading: boolean;
  authUser: DetailedUser | null;
  getAuthToken: () => string | null;
};

export const AuthContext = createContext<AuthContent>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const isLoggedIn = () => authUser != null;
  const getAuthToken = () => authToken;

  const value = { isLoggedIn, isLoading, authUser, getAuthToken };
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
