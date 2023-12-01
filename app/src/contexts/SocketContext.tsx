import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  AuthSocketData,
  BearerToken,
  RoomMessageServerSocketData,
  RoomMessageSocketData
} from '../../../shared/shared-types';
import { useRoomData } from './RoomDataContext';
import { useAuth } from './AuthContext';
import { useCurrentRoom } from './CurrentRoomContext';

const { VITE_SOCKET_URL, VITE_SOCKET_PATH } = import.meta.env;

type WebSocketContent = {
  getSocket: () => Socket;
  isSocketLive: boolean;
  isSocketConnecting: boolean;
  disconnectSocket: () => void;
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
  const { fetchAllRoomData, addMessage, roomDataArray } = useRoomData();
  const { currentRoom, currentChannel } = useCurrentRoom();

  const getSocket = () => socketWrapper.socket;

  const disconnectSocket = () => {
    const socket = getSocket();
    if (socket == null) return;
    socket.disconnect();
    socketWrapper.socket = null;
  };

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
      socket.on('roomMessageServer', (data: RoomMessageServerSocketData) => {
        addMessage(data);
      });
      socket.on('authSuccessServer', () => {
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

  useEffect(() => {
    const socket = getSocket();
    if (socket == null) return;
    socket.off('roomMessageServer');
    socket.on('roomMessageServer', (data: RoomMessageServerSocketData) => {
      addMessage(data);
    });
  }, [roomDataArray]);

  const value: WebSocketContent = {
    isSocketLive,
    isSocketConnecting,
    getSocket,
    sendMessage,
    disconnectSocket
  };
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(WebSocketContext);
}
