import LeftSidebar from '../sidebars/left-sidebar';
import Navbar from '../sidebars/nav-sidebar';

export default function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen'>
      <Navbar />
      <LeftSidebar />
      <div className='grow mx-auto mt-8 w-full max-w-[1000px] p-8'>
        {children}
      </div>
    </div>
  );
}
