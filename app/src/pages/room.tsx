import { useEffect, useRef, useState } from 'react';
import useFetch from '../hooks/useFetch';
import NotFound from './_error/error-page';
import { useParams } from 'react-router-dom';
import { RoomIdAPIResData, PostWithUser } from '../../../shared/shared-types';

const { VITE_API_URL } = import.meta.env;

export default function RoomPage() {
  const fetch = useFetch();
  const { roomId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState<RoomIdAPIResData>(null);
  const [textInput, setTextInput] = useState('');
  const postsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/room/${roomId}`, {
          method: 'GET'
        });

        if (res == null || res?.room == null)
          throw new Error('Unable to fetch room data');

        setData(res);
      } catch (err) {
        console.error(err);
        setError(err);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const postsContainer = postsContainerRef.current;
    if (!postsContainer) return;
    postsContainer.scrollTop = postsContainer.scrollHeight;
  }, [data]);

  return (
    <div className='flex page-content'>
      <div className='grow'>
        {!isLoading && error && <NotFound />}
        {isLoading && <div>Loading...</div>}
        {!isLoading && data && (
          <div className='flex flex-col h-screen'>
            <div className='room-topbar h-12 p-4 flex items-center font-smibold text-xl'>
              {data.room.name}
            </div>
            <div
              ref={postsContainerRef}
              className='overflow-auto py-4 flex flex-col gap-2 grow'
            >
              {data.room.channels?.[0].posts.map((post) => (
                <div key={post.id} className='px-4'>
                  <span className='font-semibold mr-3'>
                    {post.user.displayName}
                  </span>
                  <span>{post.content}</span>
                </div>
              ))}
            </div>
            <div className='flex'>
              <textarea
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    setTextInput('');
                    // const newPost: PostWithUser = {
                    //   id: BigInt(Math.floor(Math.random() * 100000)),
                    //   authorId: BigInt(1000),
                    //   content: textInput,
                    //   user: {
                    //     id: BigInt(1000),
                    //     role: Role.USER,
                    //     displayName: 'You'
                    //   }
                    // };
                    // setData({
                    //   ...data,
                    //   posts: [...data.posts, newPost]
                    // });
                  }
                }}
                onChange={(e) => setTextInput(e.target.value)}
                value={textInput}
                className='message-box w-full resize-none p-4 h-28 pr-[calc(40px+1rem)] bg-inherit'
                placeholder='Enter your message'
              />
              <div className='relative flex items-center'>
                <button className='!text-gray-200 right-1 h-[40px] w-[40px] mr-2 absolute button !bg-green-500 flex items-center justify-center'>
                  ⍄
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className='right-sidebar w-[200px] min-h-screen shrink-0'>
        {isLoading && <div>Loading...</div>}
        {!isLoading && data && (
          <div className='px-4 py-2 flex flex-col gap-2'>
            <h2 className='text-xl font-semibold'>Users</h2>
            {data.room.users.map((user) => (
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
