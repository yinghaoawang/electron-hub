import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useUser } from '../../contexts/UserContext';

export default function LeftSidebar() {
  const { user } = useUser();
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
          'Zhang JikeZhang JikeZhang JikeZhang JikeZhang JikeZhang JikeZhang Jike',
          'Apps',
          'Google Calendar',
          'Journal'
        ].map((item, index) => (
          <Link
            to={`/room/${index}`}
            key={index}
            className='block my-1 py-1 truncate'
          >
            {item}
          </Link>
        ))}
        d
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
