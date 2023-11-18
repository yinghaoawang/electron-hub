import { Fragment, useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { ExploreAPIData, RoomInfo } from '../../../shared/shared-types';
import { cn } from '../_lib/utils';

const { VITE_API_URL } = import.meta.env;

export default function ExplorePage() {
  const [roomInfos, setRoomInfos] = useState<RoomInfo[]>(null);
  const fetch = useFetch();
  useEffect(() => {
    const fetchData = async () => {
      const res: ExploreAPIData = await fetch(`${VITE_API_URL}/explore`, {
        method: 'GET'
      });
      setRoomInfos(res.roomInfos);
    };
    fetchData();
  }, []);
  return (
    <div className='flex mt-8 flex-col gap-2 px-4'>
      <h2 className='text-2xl font-bold mb-4'>List of Rooms</h2>
      <div className='grid grid-cols-3 gap-y-4 items-center'>
        <div className='text-lg font-semibold'>Name</div>
        <div className='text-lg font-semibold'>Users</div>
        <div></div>
        {roomInfos?.map((roomInfo) => (
          <Fragment key={roomInfo.id}>
            <div>{roomInfo.name}</div>
            <div>{roomInfo.userCount} users</div>
            <button
              disabled={roomInfo.isJoined}
              className={cn(
                'button w-20',
                roomInfo.isJoined ? '!bg-transparent' : '!bg-green-700'
              )}
            >
              {roomInfo.isJoined ? 'Joined' : 'Join'}
            </button>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
