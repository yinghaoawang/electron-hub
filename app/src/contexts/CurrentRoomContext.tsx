import { createContext, useContext, useEffect, useState } from 'react';
import { Room } from '../../../shared/shared-types';
import { useRoomData } from './RoomDataContext';

type CurrentRoomContent = {
  currentRoom: Room;
  setCurrentRoomById: (id: bigint) => void;
};

const CurrentRoomContext = createContext<CurrentRoomContent>(null);
export function CurrentRoomProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { roomDataArray, getRoomData } = useRoomData();
  const [currentRoom, setCurrentRoom] = useState<Room>(null);
  const [currentRoomId, setCurrentRoomId] = useState<bigint>(null);

  useEffect(() => {
    if (currentRoomId == null) {
      setCurrentRoom(null);
      return;
    }
    const found = getRoomData(BigInt(currentRoomId));
    setCurrentRoom(found);
  }, [currentRoomId, roomDataArray]);

  const setCurrentRoomById = (id: bigint) => {
    setCurrentRoomId(id);
  };

  const value = { currentRoom, setCurrentRoomById };
  return (
    <CurrentRoomContext.Provider value={value}>
      {children}
    </CurrentRoomContext.Provider>
  );
}
export function useCurrentRoom() {
  return useContext(CurrentRoomContext);
}
