import { useAuth } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthMessage, BearerToken } from '../../../shared/shared-types';

const { VITE_API_HOSTNAME } = import.meta.env;
const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string>(null);
  const socketWrapper = {
    socket: null as Socket
  };
  const getSocket = () => socketWrapper.socket;
  const { getToken, userId } = useAuth();

  useEffect(() => {
    if (accessToken == null) return;
    if (getSocket() != null) return;

    const headers = {
      Authorization: `Bearer ${accessToken}` as BearerToken
    };

    socketWrapper.socket = io(VITE_API_HOSTNAME);
    getSocket().on('connect', () => {
      console.log('auth header sent');
      const authMessage: AuthMessage = { headers };
      getSocket().emit('auth', authMessage);
    });
  }, [accessToken]);

  useEffect(() => {
    if (userId == null) return;

    const fetchAccessToken = async () => {
      const token = await getToken();
      setAccessToken(token);
    };

    fetchAccessToken();
  }, [userId]);

  return (
    <WebSocketContext.Provider value={{ getSocket, setAccessToken }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocketContext() {
  return useContext(WebSocketContext);
}
