import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { RoomIdAPIResData } from '../../../shared/shared-types';

const { VITE_API_URL } = import.meta.env;

export default function RoomPage() {
  const fetch = useFetch();
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<RoomIdAPIResData>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/room/${roomId}`, {
          method: 'GET'
        });
        setData(res);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <div className='flex'>
      <div className='grow'>
        {isLoading && <div>Loading...</div>}
        {!isLoading && data && (
          <div className='flex flex-col h-screen'>
            <div className='bg-neutral-700 h-12 p-4 flex items-center font-smibold text-xl'>
              {data.roomData.name}
            </div>
            <div className='overflow-auto bg-neutral-800 py-4 flex flex-col gap-2'>
              {data.posts.map((post) => (
                <div key={post.id} className='px-4'>
                  <span className='font-semibold mr-3'>
                    {post.user.displayName}
                  </span>
                  {post.content}
                </div>
              ))}
            </div>
            <div className='flex'>
              <textarea
                className='w-full h-24 resize-none p-4'
                placeholder='Enter your message'
              />
            </div>
          </div>
        )}
      </div>
      <div className='bg-gray-800 w-[200px] min-h-screen'>
        {isLoading && <div>Loading...</div>}
        {!isLoading && data && (
          <div className='px-4 py-2 flex flex-col gap-2'>
            <h2 className='text-xl font-semibold'>Users</h2>
            {data.users.map((user) => (
              <div key={user.id} className='truncate'>
                {user.displayName}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
