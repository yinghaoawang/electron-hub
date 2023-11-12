import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction
} from 'react';
import { Room } from '../../../shared/shared-types';

type RoomDataContent = {
  roomData: Room;
  setRoomData: Dispatch<SetStateAction<Room>>;
};

const RoomDataContext = createContext<RoomDataContent>(null);
export function RoomDataProvider({ children }: { children: React.ReactNode }) {
  const [roomData, setRoomData] = useState<Room>(null);
  const value = { roomData, setRoomData };
  return (
    <RoomDataContext.Provider value={value}>
      {children}
    </RoomDataContext.Provider>
  );
}
export function useRoomData() {
  return useContext(RoomDataContext);
}
