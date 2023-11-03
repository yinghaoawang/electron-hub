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
  return (
    <div className='flex min-h-screen'>
      <Navbar />
      <LeftSidebar />
      <div
        className={cn(
          'grow w-full h-screen overflow-auto',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
