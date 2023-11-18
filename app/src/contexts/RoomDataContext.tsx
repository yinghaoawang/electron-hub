import { createContext, useContext, useEffect, useState } from 'react';
import {
  Room,
  RoomIdAPIResData,
  RoomMessageServerSocketData,
  RoomsAPIResData
} from '../../../shared/shared-types';
import useFetch from '../hooks/useFetch';
import { useAuth } from './AuthContext';

const { VITE_API_URL } = import.meta.env;

type RoomDataContent = {
  roomDataArray: Room[];
  getRoomData: (id: bigint) => Room;
  setRoomData: (room: Room) => void;
  removeRoomData: (id: bigint) => void;
  fetchAllRoomData: () => Promise<void>;
  fetchRoomData: (id: bigint) => Promise<void>;
  addMessage(data: RoomMessageServerSocketData): void;
};

const RoomDataContext = createContext<RoomDataContent>(null);
export function RoomDataProvider({ children }: { children: React.ReactNode }) {
  const fetch = useFetch();
  const [roomDataArray, setRoomDataArray] = useState<Room[]>([]);
  const { authUser } = useAuth();
  const getRoomData = (id: bigint) => {
    return roomDataArray.find((room) => room.id == id);
  };
  const setRoomsData = (rooms: Room[]) => {
    const roomDataArrayCopy = [...roomDataArray];
    rooms.forEach((room) => {
      const roomIndex = roomDataArrayCopy.findIndex(
        (roomData) => roomData.id === room.id
      );
      if (roomIndex === -1) {
        roomDataArrayCopy.push(room);
      } else {
        roomDataArrayCopy[roomIndex] = room;
      }
    });
    setRoomDataArray(roomDataArrayCopy);
  };
  const removeRoomData = (id: bigint) => {
    const roomDataArrayCopy = [...roomDataArray];
    const roomIndex = roomDataArrayCopy.findIndex(
      (roomData) => roomData.id === id
    );
    if (roomIndex === -1) {
      console.error('Unable to find room');
      return;
    }
    roomDataArrayCopy.splice(roomIndex, 1);
    setRoomDataArray(roomDataArrayCopy);
  };

  const addMessage = (data: RoomMessageServerSocketData) => {
    const roomDataArrayCopy = [...roomDataArray];
    const roomIndex = roomDataArrayCopy.findIndex(
      (roomData) => roomData.id === data.roomId
    );
    if (roomIndex === -1) {
      console.error('Unable to find room');
      return;
    }
    const room = roomDataArrayCopy[roomIndex];
    const channelIndex = room.channels.findIndex(
      (channel) => channel.id === data.channelId
    );
    if (channelIndex === -1) {
      console.error('Unable to find channel');
      return;
    }
    const channel = room.channels[channelIndex];
    channel.posts.push(data.post);
    room.channels[channelIndex] = channel;
    roomDataArrayCopy[roomIndex] = room;
    setRoomDataArray(roomDataArrayCopy);
  };

  const setRoomData = (room: Room) => {
    const roomData = getRoomData(room.id);
    if (roomData == null) {
      setRoomDataArray([...roomDataArray, room]);
    } else {
      const roomDataArrayCopy = [...roomDataArray];
      const roomIndex = roomDataArrayCopy.findIndex(
        (room) => room.id === room.id
      );
      roomDataArrayCopy[roomIndex] = room;
      setRoomDataArray(roomDataArrayCopy);
    }
  };

  const fetchRoomData = async (id: bigint) => {
    try {
      const res: RoomIdAPIResData = await fetch(`${VITE_API_URL}/room/${id}`, {
        method: 'GET'
      });

      if (res == null || res?.room == null)
        throw new Error('Unable to fetch room data');

      setRoomData(res.room);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllRoomData = async () => {
    try {
      const res: RoomsAPIResData = await fetch(`${VITE_API_URL}/rooms`, {
        method: 'GET'
      });

      if (res == null || res?.rooms == null)
        throw new Error('Unable to fetch room list data');

      setRoomsData(res.rooms);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authUser == null) {
      setRoomDataArray([]);
    }
  }, [authUser]);

  const value = {
    getRoomData,
    setRoomData,
    removeRoomData,
    roomDataArray,
    fetchAllRoomData,
    fetchRoomData,
    addMessage
  };

  return (
    <RoomDataContext.Provider value={value}>
      {children}
    </RoomDataContext.Provider>
  );
}
export function useRoomData() {
  return useContext(RoomDataContext);
}
