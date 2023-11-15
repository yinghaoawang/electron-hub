import { useAuth } from '../../contexts/AuthContext';
import { useCurrentRoom } from '../../contexts/CurrentRoomContext';
import placeholderPfp from '../../_assets/placeholder.jpg';

export default function LeftSidebar() {
  const { currentRoom } = useCurrentRoom();
  const { authUser } = useAuth();

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
          <img src={placeholderPfp} className='w-10 h-10 rounded-full' />
          <span className='truncate'>{authUser.displayName}</span>
        </div>
        <div>X</div>
      </div>
    </div>
  );
}
