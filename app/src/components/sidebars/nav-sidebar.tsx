export default function NavSidebar() {
  return (
    <div className='nav-sidebar shrink-0 w-[80px] overflow-auto flex flex-col items-center h-screen'>
      <div className='flex flex-col my-4 gap-4'>
        {[
          'a',
          'b',
          'd',
          'a',
          'b',
          'd',
          'a',
          'b',
          'd',
          'a',
          'b',
          'd',
          'a',
          'b',
          'd',
          'a',
          'b',
          'd'
        ].map((item, index) => (
          <div
            key={index}
            className='nav-icon h-12 w-12 flex items-center justify-center rounded-full'
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
