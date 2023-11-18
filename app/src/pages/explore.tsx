import { Fragment, useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import {
  ExploreAPIData,
  JoinRoomAPIData,
  RoomInfo
} from '../../../shared/shared-types';
import { cn } from '../_lib/utils';

const { VITE_API_URL } = import.meta.env;

const RoomInfoRow = ({ roomInfo }: { roomInfo: RoomInfo }) => {
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const fetch = useFetch();

  const handleJoinRoom = (roomId: bigint) => {
    const joinRoom = async () => {
      setIsJoining(true);
      try {
        const data: JoinRoomAPIData = {
          roomId
        };
        const res = await fetch(`${VITE_API_URL}/join-room`, {
          method: 'POST',
          body: JSON.stringify(data)
        });
        console.log(res);
      } catch (error) {
        console.error('Unable to join room', error);
      }
      setIsJoining(false);
    };
    joinRoom();
  };
  return (
    <Fragment>
      <div>{roomInfo.name}</div>
      <div>{roomInfo.userCount} users</div>
      <button
        disabled={roomInfo.isJoined || isJoining}
        onClick={() => handleJoinRoom(roomInfo.id)}
        className={cn(
          'button w-20',
          roomInfo.isJoined ? '!bg-transparent' : '!bg-green-700'
        )}
      >
        {isJoining && '...'}
        {!isJoining && (roomInfo.isJoined ? 'Joined' : 'Join')}
      </button>
    </Fragment>
  );
};

export default function ExplorePage() {
  const [roomInfos, setRoomInfos] = useState<RoomInfo[]>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const fetch = useFetch();
  useEffect(() => {
    const fetchData = async () => {
      const res: ExploreAPIData = await fetch(`${VITE_API_URL}/explore`, {
        method: 'GET'
      });
      setRoomInfos(res.roomInfos);
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div className='flex mt-8 flex-col gap-2 px-8'>
      {isLoading && 'Loading...'}
      {!isLoading && (
        <>
          <h2 className='text-2xl font-bold mb-4'>List of Rooms</h2>
          <div className='grid grid-cols-3 gap-y-4 items-center'>
            <div className='text-lg font-semibold'>Name</div>
            <div className='text-lg font-semibold'>Users</div>
            <div></div>
            {roomInfos?.map((roomInfo) => (
              <RoomInfoRow key={roomInfo.id} roomInfo={roomInfo} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
