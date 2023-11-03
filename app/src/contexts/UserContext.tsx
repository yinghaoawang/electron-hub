import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser as useClerkUser } from '@clerk/clerk-react';
import { UserResource } from '@clerk/types';

export type User = UserResource | null;
type UserContent = {
  user: User;
  isLoading: boolean;
};

export const UserContext = createContext<UserContent>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setUser(clerkUser);
  }, [clerkUser]);
  useEffect(() => {
    setIsLoading(!isLoaded);
  });
  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
