import { createContext, useContext, useState } from 'react';
import { Room, RoomsAPIResData } from '../../../shared/shared-types';
import useFetch from '../hooks/useFetch';

const { VITE_API_URL } = import.meta.env;

type RoomDataContent = {
  roomDataArray: Room[];
  getRoomData: (id: bigint) => Room;
  setRoomData: (room: Room) => void;
  fetchAllRoomData: () => Promise<void>;
};

const RoomDataContext = createContext<RoomDataContent>(null);
export function RoomDataProvider({ children }: { children: React.ReactNode }) {
  const fetch = useFetch();
  const [roomDataArray, setRoomDataArray] = useState<Room[]>([]);
  const getRoomData = (id: bigint) => {
    return roomDataArray.find((room) => BigInt(room.id) == id);
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
  // fetch all rooms on connection
  const fetchAllRoomData = async () => {
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
    }
  };

  const value = { getRoomData, setRoomData, roomDataArray, fetchAllRoomData };

  return (
    <RoomDataContext.Provider value={value}>
      {children}
    </RoomDataContext.Provider>
  );
}
export function useRoomData() {
  return useContext(RoomDataContext);
}
