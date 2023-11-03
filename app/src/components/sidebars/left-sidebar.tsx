import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

export default function LeftSidebar() {
  return (
    <div className='left-sidebar shrink-0 w-[250px] h-screen flex flex-col justify-between'>
      <div className='px-4 overflow-auto'>
        <div className='flex flex-col gap-1'></div>
        <Link to={'/'} className='my-1 py-1'>
          Home
        </Link>
        <Link to={'/about'} className='my-1 py-1'>
          About
        </Link>
        {[
          'Unreads',
          'Drafts & sent',
          'Channels',
          '# announcements',
          '# random',
          '# design-crit',
          'Gizmo',
          '# launch-gizmo',
          '# team-gizmo',
          '# project-gizmo',
          'Direct Messages',
          'Ma Long',
          'Wang Hao',
          'Fan Zhendong',
          'Zhang Jike',
          'Apps',
          'Google Calendar',
          'Journal'
        ].map((item, index) => (
          <div key={index} className='my-1 py-1'>
            {item}
          </div>
        ))}
        d
      </div>
      <div className='bg-black/40 p-4 flex shrink-0 h-20 items-center gap-2'>
        <UserButton />
      </div>
    </div>
  );
}
