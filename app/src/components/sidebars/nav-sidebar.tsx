import { useAuth } from '../../contexts/AuthContext';
import { useCurrentRoom } from '../../contexts/CurrentRoomContext';
import { useRoomData } from '../../contexts/RoomDataContext';
import { Link } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';

export default function NavSidebar() {
  const { logOut } = useAuth();
  const { roomDataArray } = useRoomData();
  const { setCurrentRoomById } = useCurrentRoom();
  const { disconnectSocket } = useSocket();
  return (
    <div className='nav-sidebar shrink-0 w-[80px] overflow-auto flex flex-col items-center h-screen'>
      <div className='flex flex-col my-4 gap-4'>
        <Link
          to={'/'}
          onClick={() => setCurrentRoomById(null)}
          className='nav-icon h-12 w-12 flex items-center justify-center rounded-full !bg-slate-700'
        >
          Hom
        </Link>
        <Link
          to={'/about'}
          onClick={() => setCurrentRoomById(null)}
          className='nav-icon h-12 w-12 flex items-center justify-center rounded-full !bg-zinc-700'
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
        <Link
          to={'/explore'}
          onClick={() => setCurrentRoomById(null)}
          className='nav-icon h-12 w-12 flex items-center justify-center rounded-full !bg-green-700'
        >
          Rooms
        </Link>
        <button
          onClick={() => {
            setCurrentRoomById(null);
            logOut();
            disconnectSocket();
          }}
          className='nav-icon h-12 w-12 flex items-center justify-center rounded-full !bg-red-700'
        >
          Logot
        </button>
      </div>
    </div>
  );
}
