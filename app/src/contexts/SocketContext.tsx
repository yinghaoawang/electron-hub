import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  AuthMessage,
  BearerToken,
  RoomsAPIResData
} from '../../../shared/shared-types';
import { useRoomData } from './RoomDataContext';
import useFetch from '../hooks/useFetch';
import { useAuth } from './AuthContext';

const { VITE_SOCKET_URL, VITE_SOCKET_PATH, VITE_API_URL } = import.meta.env;

const WebSocketContext = createContext(null);

const socketWrapper = {
  socket: null as Socket
};

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { authToken, authUser } = useAuth();
  const [isSocketLive, setIsSocketLive] = useState<boolean>(false);
  const [isSocketConnecting, setIsSocketConnecting] = useState<boolean>(true);
  const getSocket = () => socketWrapper.socket;
  const { setRoomData } = useRoomData();
  const fetch = useFetch();

  useEffect(() => {
    if (authToken == null) return;
    if (authUser == null) return;
    if (getSocket() != null) return;

    const headers = {
      Authorization: `Bearer ${authToken}` as BearerToken
    };

    socketWrapper.socket = io(VITE_SOCKET_URL, {
      path: VITE_SOCKET_PATH,
      transports: ['websocket']
    });
    getSocket().on('connect', () => {
      setIsSocketConnecting(true);
      const socket = getSocket();
      const authMessage: AuthMessage = { headers };
      socket.emit('auth', authMessage);
      socket.on('auth-success', () => {
        console.log('Successfully authenticated with WebSocket server');
        setIsSocketLive(true);
        setIsSocketConnecting(false);

        // fetch all rooms on connection
        const fetchData = async () => {
          try {
            const res: RoomsAPIResData = await fetch(`${VITE_API_URL}/rooms`, {
              method: 'GET'
            });

            if (res == null || res?.rooms == null)
              throw new Error('Unable to fetch room list data');

            res?.rooms.forEach((room) => {
              setRoomData(room);
            });
          } catch (err) {
            console.error(err);
            // setError(err);
          }
          // setIsLoading(false);
        };
        fetchData();
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
  }, [authToken, authUser]);

  return (
    <WebSocketContext.Provider
      value={{ isSocketLive, isSocketConnecting, getSocket }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(WebSocketContext);
}
