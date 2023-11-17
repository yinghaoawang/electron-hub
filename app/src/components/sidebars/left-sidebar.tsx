import { useAuth } from '../../contexts/AuthContext';
import { useCurrentRoom } from '../../contexts/CurrentRoomContext';
import placeholderPfp from '../../_assets/placeholder.jpg';
import { cn } from '../../_lib/utils';

export default function LeftSidebar() {
  const { currentRoom, currentChannel } = useCurrentRoom();
  const { authUser } = useAuth();

  return (
    <div className='left-sidebar shrink-0 w-[250px] h-screen flex flex-col justify-between'>
      <div className='pt-4 px-4 overflow-auto'>
        {currentRoom && <div className='text-xl font-semibold mb-2'>Channels</div>}
        {currentRoom?.channels.map((channel, index) => (
          <button
            key={index}
            className={cn(
              'flex my-1 py-1 truncate w-full px-4 h-10 items-center rounded-md',
              channel == currentChannel && '!bg-neutral-800'
            )}
          >
            <span className='mr-2'>#</span>
            <span>{channel.name}</span>
          </button>
        ))}
      </div>
      <div className='user-tray flex items-center shrink-0 h-20 p-4 justify-between'>
        <div className='flex gap-3 items-center'>
          <img src={placeholderPfp} className='w-10 h-10 rounded-full' />
          <span className='truncate'>{authUser.displayName}</span>
        </div>
        <div>X</div>
      </div>
    </div>
  );
}
