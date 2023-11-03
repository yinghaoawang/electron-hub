import { Link } from 'react-router-dom';

export default function LeftSidebar() {
  return (
    <div className='left-sidebar shrink-0 px-4 w-[250px] h-screen overflow-auto'>
      <div className='flex flex-col gap-1'>
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
      </div>
    </div>
  );
}
