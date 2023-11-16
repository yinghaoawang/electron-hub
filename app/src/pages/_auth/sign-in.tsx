import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { cn } from '../../_lib/utils';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function SignInPage() {
  const { logIn, authUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const onSubmit = async ({
    email,
    password
  }: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    await logIn(email, password, () => {
      navigate('/');
    });
    setIsLoading(false);
  };
  useEffect(() => {
    if (authUser != null) {
      navigate('/');
    }
  });

  return (
    <form
      className='flex flex-col gap-4 bg-neutral-900 max-w-[350px] w-full p-8 rounded-xl'
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className='text-lg font-semibold mb-2'>Sign In</h2>
      <input
        disabled={isLoading}
        className={cn('form-input', errors.email && 'border border-red-500')}
        placeholder='Email'
        {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
      />
      <input
        disabled={isLoading}
        className={cn('form-input', errors.password && 'border border-red-500')}
        type='password'
        placeholder='Password'
        {...register('password', {
          required: true,
          minLength: 8,
          maxLength: 50
        })}
      />
      <div className='flex flex-col gap-3 mb-2'>
        <button disabled={isLoading} className='button !bg-gray-800'>
          Sign In
        </button>
        <Link className='text-center' to='/sign-up'>
          Sign Up
        </Link>
      </div>
    </form>
  );
}
