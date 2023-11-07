import { useAuth } from '@clerk/clerk-react';
import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { AuthMessage, BearerToken } from '../../../shared/shared-types';

const { VITE_API_HOSTNAME } = import.meta.env;
const WebSocketContext = createContext(null);

const socketWrapper = {
  socket: null as Socket
};

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string>(null);
  const [isSocketLive, setIsSocketLive] = useState<boolean>(false);
  const [isSocketConnecting, setIsSocketConnecting] = useState<boolean>(true);
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
      setIsSocketConnecting(true);
      const socket = getSocket();
      const authMessage: AuthMessage = { headers };
      socket.emit('auth', authMessage);
      socket.on('auth-success', () => {
        console.log('Successfully authenticated with WebSocket server');
        setIsSocketLive(true);
        setIsSocketConnecting(false);
      });
      socket.on('auth-failure', () => {
        console.error('Failed to authenticate with WebSocket server');
        setIsSocketLive(false);
        setIsSocketConnecting(false);
      });
      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsSocketLive(false);
        setIsSocketConnecting(false);
      });
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
    <WebSocketContext.Provider
      value={{ isSocketLive, isSocketConnecting, getSocket, setAccessToken }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(WebSocketContext);
}
