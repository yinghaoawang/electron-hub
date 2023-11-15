import React, { createContext, useContext, useEffect, useState } from 'react';

type UserContent = {
  isLoading: boolean;
};

export const UserContext = createContext<UserContent>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null>(null);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <UserContext.Provider value={{ isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
