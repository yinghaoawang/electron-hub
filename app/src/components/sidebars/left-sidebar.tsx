import { UserButton } from '@clerk/clerk-react';
import { useUser } from '../../contexts/UserContext';
import { useCurrentRoom } from '../../contexts/CurrentRoomContext';

export default function LeftSidebar() {
  const { user } = useUser();
  const { currentRoom } = useCurrentRoom();

  return (
    <div className='left-sidebar shrink-0 w-[250px] h-screen flex flex-col justify-between'>
      <div className='px-4 overflow-auto'>
        <div className='flex flex-col gap-1'></div>
        {currentRoom?.channels.map((channel, index) => (
          <button key={index} className='block my-1 py-1 truncate'>
            {channel.name}
          </button>
        ))}
      </div>
      <div className='user-tray flex items-center shrink-0 h-20 p-4 justify-between'>
        <div className='flex gap-3 items-center'>
          <UserButton
            appearance={{ elements: {} }}
            afterSignOutUrl='/sign-in'
          />
          <span className='truncate'>{user?.fullName}</span>
        </div>
        <div>X</div>
      </div>
    </div>
  );
}
