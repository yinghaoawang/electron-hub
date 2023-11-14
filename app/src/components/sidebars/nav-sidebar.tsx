import { useCurrentRoom } from '../../contexts/CurrentRoomContext';
import { useRoomData } from '../../contexts/RoomDataContext';
import { Link } from 'react-router-dom';

export default function NavSidebar() {
  const { roomDataArray } = useRoomData();
  const { setCurrentRoomById } = useCurrentRoom();
  return (
    <div className='nav-sidebar shrink-0 w-[80px] overflow-auto flex flex-col items-center h-screen'>
      <div className='flex flex-col my-4 gap-4'>
        <Link
          to={'/'}
          onClick={() => setCurrentRoomById(null)}
          className='nav-icon h-12 w-12 flex items-center justify-center rounded-full'
        >
          Hom
        </Link>
        <Link
          to={'/about'}
          onClick={() => setCurrentRoomById(null)}
          className='nav-icon h-12 w-12 flex items-center justify-center rounded-full'
        >
          Abt
        </Link>
        {roomDataArray.map((room, index) => (
          <Link
            key={index}
            to={`/room/${room.id}`}
            className='nav-icon h-12 w-12 flex items-center justify-center rounded-full'
          >
            {room.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
