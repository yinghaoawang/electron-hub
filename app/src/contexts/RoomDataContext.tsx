import { createContext, useContext, useState } from 'react';
import { Room } from '../../../shared/shared-types';

type RoomDataContent = {
  roomDataArray: Room[];
  getRoomData: (id: bigint) => Room;
  setRoomData: (room: Room) => void;
};

const RoomDataContext = createContext<RoomDataContent>(null);
export function RoomDataProvider({ children }: { children: React.ReactNode }) {
  const [roomDataArray, setRoomDataArray] = useState<Room[]>([]);
  const getRoomData = (id: bigint) => {
    return roomDataArray.find((room) => BigInt(room.id) === id);
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

  const value = { getRoomData, setRoomData, roomDataArray };

  return (
    <RoomDataContext.Provider value={value}>
      {children}
    </RoomDataContext.Provider>
  );
}
export function useRoomData() {
  return useContext(RoomDataContext);
}
