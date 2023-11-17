import { createContext, useContext, useEffect, useState } from 'react';
import { Channel, Room } from '../../../shared/shared-types';
import { useRoomData } from './RoomDataContext';

type CurrentRoomContent = {
  currentRoom: Room;
  setCurrentRoomById: (id: bigint) => void;
  currentChannel: Channel;
  setCurrentChannelById: (id: bigint) => void;
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

  const [currentChannel, setCurrentChannel] = useState<Channel>(null);
  const [currentChannelId, setCurrentChannelId] = useState<bigint>(null);

  useEffect(() => {
    if (currentRoomId == null) {
      setCurrentRoom(null);
      return;
    }
    const found = getRoomData(BigInt(currentRoomId));
    setCurrentRoom(found);
    setCurrentChannelById(found?.channels[0]?.id);
  }, [currentRoomId, roomDataArray]);

  const setCurrentRoomById = (id: bigint) => {
    setCurrentRoomId(id);
  };

  useEffect(() => {
    if (currentChannelId == null || currentRoom == null) {
      setCurrentChannel(null);
      return;
    }
    const found = currentRoom.channels?.find(
      (channel) => channel.id == currentChannelId
    );

    setCurrentChannel(found);
  }, [currentRoom, roomDataArray]);

  const setCurrentChannelById = (id: bigint) => {
    setCurrentChannelId(id);
  };

  const value = {
    currentRoom,
    setCurrentRoomById,
    currentChannel,
    setCurrentChannelById
  };
  return (
    <CurrentRoomContext.Provider value={value}>
      {children}
    </CurrentRoomContext.Provider>
  );
}
export function useCurrentRoom() {
  return useContext(CurrentRoomContext);
}
