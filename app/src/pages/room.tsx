import { useEffect, useRef, useState } from 'react';
import { useCurrentRoom } from '../contexts/CurrentRoomContext';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useRoomData } from '../contexts/RoomDataContext';

export default function RoomPage() {
  const { roomId } = useParams();
  const [textInput, setTextInput] = useState('');
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const { currentRoom, setCurrentRoomById } = useCurrentRoom();
  const { roomDataArray } = useRoomData();
  const { sendMessage } = useSocket();

  if (roomId == null) {
    throw new Error('Missing roomId');
  }

  useEffect(() => {
    if (roomDataArray.length === 0) {
      return;
    }
    setCurrentRoomById(BigInt(roomId));
  }, [roomId, roomDataArray]);

  useEffect(() => {
    const postsContainer = postsContainerRef.current;
    if (!postsContainer) return;
    postsContainer.scrollTop = postsContainer.scrollHeight;
  }, [currentRoom]);

  return (
    <div className='flex page-content'>
      <div className='grow'>
        {currentRoom && (
          <div className='flex flex-col h-screen'>
            <div className='room-topbar h-12 p-4 flex items-center font-smibold text-xl'>
              {currentRoom.name}
            </div>
            <div
              ref={postsContainerRef}
              className='overflow-auto py-4 flex flex-col gap-2 grow'
            >
              {currentRoom.channels?.[0]?.posts?.map((post) => (
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
                    sendMessage(textInput);
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
        {currentRoom && (
          <div className='px-4 py-2 flex flex-col gap-2'>
            <h2 className='text-xl font-semibold'>Users</h2>
            {currentRoom.users.map((user) => (
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
