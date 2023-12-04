import { useEffect, useRef, useState } from 'react';
import { useCurrentRoom } from '../contexts/CurrentRoomContext';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useRoomData } from '../contexts/RoomDataContext';
import { ChannelType, PostWithUser } from '../../../shared/shared-types';
import VideoContent from '../components/video-content';

const TextChannelContent = ({ posts }: { posts: PostWithUser[] }) => {
  const reversedPosts = posts?.slice().reverse();
  return (
    <div className='py-4'>
      {reversedPosts?.map((post) => (
        <div key={post.id} className='px-4'>
          <span className='font-semibold mr-3'>{post.user.displayName}</span>
          <span>{post.content}</span>
        </div>
      ))}
    </div>
  );
};

export default function RoomPage() {
  const { roomId } = useParams();
  const [textInput, setTextInput] = useState('');
  const postsContainerRef = useRef<HTMLDivElement>(null);
  const { currentRoom, currentChannel, setCurrentRoomById } = useCurrentRoom();
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

  return (
    <div className='flex page-content'>
      <div className='grow'>
        {currentRoom && (
          <div className='flex flex-col h-screen'>
            <div className='room-topbar px-4 flex items-center font-smibold text-xl'>
              {currentRoom.name}
            </div>
            <div
              ref={postsContainerRef}
              className='overflow-auto flex flex-col-reverse gap-2 grow'
            >
              {currentChannel?.type === ChannelType.VOICE ? (
                <VideoContent />
              ) : (
                <TextChannelContent posts={currentChannel?.posts} />
              )}
            </div>
            {currentChannel?.type === ChannelType.TEXT && (
              <div className='flex'>
                <textarea
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      setTextInput('');
                      sendMessage(textInput);
                    }
                  }}
                  disabled={currentChannel == null}
                  onChange={(e) => setTextInput(e.target.value)}
                  value={textInput}
                  className='message-box w-full resize-none p-4 h-28 pr-[calc(40px+1rem)] bg-inherit'
                  placeholder={'Enter your message'}
                />
                <div className='relative flex items-center'>
                  <button className='!text-gray-200 right-1 h-[40px] w-[40px] mr-2 absolute button !bg-green-500 flex items-center justify-center'>
                    ⍄
                  </button>
                </div>
              </div>
            )}
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
