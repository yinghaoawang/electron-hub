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
        className={cn('grow mx-auto mt-8 w-full max-w-[1000px] p-8', className)}
      >
        {children}
      </div>
    </div>
  );
}
