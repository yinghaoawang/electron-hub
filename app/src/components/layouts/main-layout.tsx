import { useSocket } from '../../contexts/SocketContext';
import { cn } from '../../_lib/utils';
import LeftSidebar from '../sidebars/left-sidebar';
import Navbar from '../sidebars/nav-sidebar';

export default function MainLayout({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isSocketLive, isSocketConnecting } = useSocket();
  let socketStatusMessage;
  if (isSocketConnecting) socketStatusMessage = 'Connecting...';
  else socketStatusMessage = isSocketLive ? 'Connected' : 'Disconnected';

  return (
    <div className='flex min-h-screen'>
      <div
        className={cn(
          'absolute right-2 top-1 text-xs px-2 py-1 w-28 flex justify-center items-center rounded-full',
          isSocketLive ? 'bg-green-500' : 'bg-red-500',
          isSocketConnecting && 'bg-yellow-500'
        )}
      >
        {socketStatusMessage}
      </div>

      <Navbar />
      <LeftSidebar />
      <div className={cn('grow w-full h-screen overflow-auto', className)}>
        {children}
      </div>
    </div>
  );
}
