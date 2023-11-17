import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  AuthSocketData,
  BearerToken,
  RoomMessageSocketData
} from '../../../shared/shared-types';
import { useRoomData } from './RoomDataContext';
import { useAuth } from './AuthContext';
import { useCurrentRoom } from './CurrentRoomContext';

const { VITE_SOCKET_URL, VITE_SOCKET_PATH } = import.meta.env;

type WebSocketContent = {
  isSocketLive: boolean;
  isSocketConnecting: boolean;
  sendMessage: (message: string) => void;
};

const WebSocketContext = createContext<WebSocketContent>(null);

const socketWrapper = {
  socket: null as Socket
};

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { authToken, authUser } = useAuth();
  const [isSocketLive, setIsSocketLive] = useState<boolean>(false);
  const [isSocketConnecting, setIsSocketConnecting] = useState<boolean>(true);
  const { fetchAllRoomData } = useRoomData();
  const { currentRoom, currentChannel } = useCurrentRoom();

  const getSocket = () => socketWrapper.socket;

  const sendMessage = (message: string) => {
    const socket = getSocket();
    if (socket == null) {
      console.error('Socket is not connected');
      return;
    }
    const data: RoomMessageSocketData = {
      message,
      roomId: currentRoom.id,
      channelId: currentChannel.id
    };
    socket.emit('roomMessage', data);
  };

  useEffect(() => {
    if (authToken == null) return;
    if (authUser == null) return;
    if (getSocket() != null) return;

    socketWrapper.socket = io(VITE_SOCKET_URL, {
      path: VITE_SOCKET_PATH,
      transports: ['websocket']
    });
    getSocket().on('connect', () => {
      setIsSocketConnecting(true);
      const socket = getSocket();
      const bearerToken = `Bearer ${authToken}` as BearerToken;
      const authMessage: AuthSocketData = {
        bearerToken
      };
      socket.emit('auth', authMessage);
      socket.on('authSuccess', () => {
        console.log('Successfully authenticated with WebSocket server');
        setIsSocketLive(true);
        setIsSocketConnecting(false);

        fetchAllRoomData();
      });
      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsSocketLive(false);
        setIsSocketConnecting(false);
      });
    });
  }, [authToken, authUser]);

  const value = { isSocketLive, isSocketConnecting, getSocket, sendMessage };
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(WebSocketContext);
}
