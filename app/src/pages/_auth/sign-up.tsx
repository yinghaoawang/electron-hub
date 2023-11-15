import { Link } from 'react-router-dom';

export default function SignUpPage() {
  return (
    <div className='flex flex-col gap-4 bg-neutral-900 max-w-[350px] w-full p-8 rounded-xl'>
      <h2 className='text-lg font-semibold mb-2'>Sign Up</h2>
      <input className='form-input' placeholder='Display Name' />
      <input className='form-input' placeholder='Email' />
      <input className='form-input' placeholder='Password' />
      <input className='form-input' placeholder='Confirm Password' />
      <div className='flex flex-col gap-3 mb-2'>
        <button className='button !bg-gray-800'>Sign Up</button>
        <Link className='text-center' to='/sign-in'>
          Sign In
        </Link>
      </div>
    </div>
  );
}
